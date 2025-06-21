// main.go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Project struct {
	ID       string  `gorm:"primaryKey" json:"id"`
	Name     string  `json:"name"`
	Duration int     `json:"duration"`
	Layers   []Layer `gorm:"foreignKey:ProjectID" json:"layers"`
}

type Layer struct {
	ID        string          `gorm:"primaryKey" json:"id"`
	ProjectID string          `json:"-"`
	Name      string          `json:"name"`
	Type      string          `json:"type"`
	Visible   bool            `json:"visible"`
	Locked    bool            `json:"locked"`
	Events    []TimelineEvent `gorm:"foreignKey:LayerID" json:"events"`
}

type TimelineEvent struct {
	ID       string `gorm:"primaryKey" json:"id"`
	LayerID  string `json:"-"`
	Type     string `json:"type"`
	Start    int    `json:"start"`
	Duration int    `json:"duration"`

	// for ClipPayload (example only)
	Src      string   `json:"src"`
	InPoint  int      `json:"inPoint"`
	OutPoint int      `json:"outPoint"`
	Volume   *float64 `json:"volume"`
}

var db *gorm.DB

func main() {
	dbInit()
	r := gin.Default()

	r.GET("/projects", getProjects)
	r.POST("/projects", createProject)

	r.Run()
}

func dbInit() {
	database, err := gorm.Open(sqlite.Open("projects.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db = database
	db.AutoMigrate(&Project{}, &Layer{}, &TimelineEvent{})
	seed()
}

func seed() {
	db.Where("1 = 1").Delete(&TimelineEvent{})
	db.Where("1 = 1").Delete(&Layer{})
	db.Where("1 = 1").Delete(&Project{})

	vol := 0.8
	project := Project{
		ID:       "p1",
		Name:     "Test Project",
		Duration: 300,
		Layers: []Layer{
			{
				ID:      "l1",
				Name:    "Video Layer",
				Type:    "video",
				Visible: true,
				Locked:  false,
				Events: []TimelineEvent{
					{
						ID:       "e1",
						Type:     "clip",
						Start:    0,
						Duration: 100,
						Src:      "media/video.mp4",
						InPoint:  0,
						OutPoint: 100,
						Volume:   &vol,
					},
				},
			},
		},
	}
	db.Create(&project)
}

func getProjects(c *gin.Context) {
	var projects []Project
	db.Preload("Layers").Preload("Layers.Events").Find(&projects)
	c.JSON(http.StatusOK, projects)
}

func createProject(c *gin.Context) {
	var project Project
	if err := c.BindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.Create(&project)
	c.JSON(http.StatusCreated, project)
}
