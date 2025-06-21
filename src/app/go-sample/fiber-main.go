package main

import (
	"log"
	"math/rand"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Project struct {
	ID       string  `json:"id" gorm:"primaryKey"`
	Name     string  `json:"name"`
	Duration int     `json:"duration"`
	Layers   []Layer `json:"layers" gorm:"foreignKey:ProjectID"`
}

type Layer struct {
	ID        string          `json:"id" gorm:"primaryKey"`
	ProjectID string          `json:"-"`
	Name      string          `json:"name"`
	Type      string          `json:"type"`
	Visible   bool            `json:"visible"`
	Locked    bool            `json:"locked"`
	Events    []TimelineEvent `json:"events" gorm:"foreignKey:LayerID"`
}

type TimelineEvent struct {
	ID       string  `json:"id" gorm:"primaryKey"`
	LayerID  string  `json:"-"`
	Type     string  `json:"type"`
	Start    int     `json:"start"`
	Duration int     `json:"duration"`
	Src      string  `json:"src"`
	InPoint  int     `json:"inPoint"`
	OutPoint int     `json:"outPoint"`
	Volume   float32 `json:"volume"`
}

var db *gorm.DB

func seed() {
	for p := 0; p < 5; p++ {
		projID := "p" + strconv.Itoa(p)
		project := Project{
			ID:       projID,
			Name:     "Project " + strconv.Itoa(p),
			Duration: 300,
		}
		for l := 0; l < 3; l++ {
			layerID := projID + "-l" + strconv.Itoa(l)
			layer := Layer{
				ID:      layerID,
				Name:    "Layer " + strconv.Itoa(l),
				Type:    "video",
				Visible: true,
				Locked:  false,
			}
			for c := 0; c < 50; c++ {
				event := TimelineEvent{
					ID:       layerID + "-e" + strconv.Itoa(c),
					Type:     "clip",
					Start:    c * 10,
					Duration: 10,
					Src:      "video.mp4",
					InPoint:  0,
					OutPoint: 10,
					Volume:   rand.Float32(),
				}
				layer.Events = append(layer.Events, event)
			}
			project.Layers = append(project.Layers, layer)
		}
		db.Create(&project)
	}
}

func main() {
	var err error
	db, err = gorm.Open(sqlite.Open("fiber_projects.db"), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	db.AutoMigrate(&Project{}, &Layer{}, &TimelineEvent{})
	seed()

	app := fiber.New()

	app.Get("/projects", func(c *fiber.Ctx) error {
		var projects []Project
		db.Preload("Layers").Preload("Layers.Events").Find(&projects)
		return c.JSON(projects)
	})

	app.Post("/projects", func(c *fiber.Ctx) error {
		var p Project
		if err := c.BodyParser(&p); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		db.Create(&p)
		return c.JSON(p)
	})

	app.Patch("/clip/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var update TimelineEvent
		if err := c.BodyParser(&update); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		var clip TimelineEvent
		if err := db.First(&clip, "id = ?", id).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "clip not found"})
		}
		clip.InPoint = update.InPoint
		clip.OutPoint = update.OutPoint
		db.Save(&clip)
		return c.JSON(clip)
	})

	log.Fatal(app.Listen(":8080"))
}
