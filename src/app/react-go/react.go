package main

import (
	"fmt"
	"time"
)

type UIComponent interface {
	Render(ctx *Context) string
}

type TextComponent struct {
	Text string
}

func (t TextComponent) Render(ctx *Context) string {
	return t.Text
}

type DivComponent struct {
	Children []UIComponent
}

func (d DivComponent) Render(ctx *Context) string {
	result := "<div>"
	for _, child := range d.Children {
		result += child.Render(ctx)
	}
	result += "</div>"
	return result
}

// Context

type Context struct {
	Values map[string]string
}

type ContextProvider struct {
	Context  *Context
	Children []UIComponent
}

func (cp ContextProvider) Render() string {
	result := "<context>"
	for _, child := range cp.Children {
		result += child.Render(cp.Context)
	}
	result += "</context>"
	return result
}

type ContextTextComponent struct {
}

func (ctc ContextTextComponent) Render(ctx *Context) string {
	if value, exist := ctx.Values["text"]; exist {
		return value
	}
	return ""
}

func main() {
	fmt.Println("React Go Example")

	text := TextComponent{Text: "Hello, World!"}
	contextText := ContextTextComponent{}
	div := DivComponent{
		Children: []UIComponent{
			text,
			contextText,
		},
	}
	context := &Context{
		Values: map[string]string{"text": "Hello from context!"},
	}
	contextProvider := ContextProvider{
		Context:  context,
		Children: []UIComponent{div},
	}

	ticker := time.Tick(1 * time.Second)
	for range ticker {
	}

	fmt.Println(contextProvider.Render())
}
