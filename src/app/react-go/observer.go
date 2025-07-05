package main

import (
	"fmt"
	"sync"
)

// State 管理 + Observer
type State struct {
	mu        sync.Mutex
	value     int
	observers []func(int) // 状態変化時に呼ぶ関数群
}

func NewState(initial int) *State {
	return &State{
		value:     initial,
		observers: []func(int){},
	}
}

func (s *State) Get() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.value
}

func (s *State) Set(newVal int) {
	s.mu.Lock()
	s.value = newVal
	s.mu.Unlock()
	s.notify()
}

func (s *State) notify() {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, observer := range s.observers {
		observer(s.value)
	}
}

func (s *State) Subscribe(f func(int)) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.observers = append(s.observers, f)
}

// Render関数
func Render(value int) {
	fmt.Printf("Render called with state = %d\n", value)
}

func main() {
	state := NewState(0)

	// 状態変化を検知してRenderを呼ぶ
	state.Subscribe(Render)

	// 状態を変更すると自動的にRenderが呼ばれる
	state.Set(1)
	state.Set(42)
}
