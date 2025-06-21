package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
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
	dsn := "user:password@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	db = database
	db.AutoMigrate(&Project{}, &Layer{}, &TimelineEvent{})
	seed()

	r := gin.Default()

	r.GET("/projects", GetProjects)

	r.POST("/projects", func(c *gin.Context) {
		var p Project
		if err := c.BindJSON(&p); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		db.Create(&p)
		c.JSON(http.StatusOK, p)
	})

	r.PATCH("/clip/:id", func(c *gin.Context) {
		id := c.Param("id")
		var update TimelineEvent
		if err := c.BindJSON(&update); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		var clip TimelineEvent
		if err := db.First(&clip, "id = ?", id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "clip not found"})
			return
		}
		clip.InPoint = update.InPoint
		clip.OutPoint = update.OutPoint
		db.Save(&clip)
		c.JSON(http.StatusOK, clip)
	})

	r.Run(":8000")
}

func GetProjects(c *gin.Context) {
	var projects []Project
	if err := db.Find(&projects).Error; err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	for i := range projects {
		var layers []Layer
		if err := db.Where("project_id = ?", projects[i].ID).Find(&layers).Error; err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		for j := range layers {
			var events []TimelineEvent
			if err := db.Where("layer_id = ?", layers[j].ID).Find(&events).Error; err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			layers[j].Events = events
		}

		projects[i].Layers = layers
	}
	fmt.Println("Projects retrieved successfully")

	c.JSON(200, projects)
}
