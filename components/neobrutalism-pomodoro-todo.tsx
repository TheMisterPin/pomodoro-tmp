/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, ChevronDown, ChevronRight } from "lucide-react"

type Task = {
  id: string
  title: string
  category: "chores" | "work" | "sport" | "relax"
  completed: boolean
  subtasks: SubTask[]
}

type SubTask = {
  id: string
  title: string
  completed: boolean
}

export function NeobrutalismPomodoroTodo() {
  const [focusTime, setFocusTime] = useState(25)
  const [pauseTime, setPauseTime] = useState(5)
  const [repetitions, setRepetitions] = useState(4)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentPhase, setCurrentPhase] = useState("focus")
  const [currentRepetition, setCurrentRepetition] = useState(1)
  const [timeRemaining, setTimeRemaining] = useState(focusTime * 60)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState<"chores" | "work" | "sport" | "relax">("work")
  const [expandedTasks, setExpandedTasks] = useState<string[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1
          } else {
            if (currentPhase === "focus") {
              if (currentRepetition < repetitions) {
                setCurrentPhase("pause")
                setTimeRemaining(pauseTime * 60)
              } else {
                stopTimer()
              }
            } else {
              setCurrentPhase("focus")
              setCurrentRepetition((prev) => prev + 1)
              setTimeRemaining(focusTime * 60)
            }
            return 0
          }
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, isPaused, currentPhase, currentRepetition, focusTime, pauseTime, repetitions])

  const startNewSession = () => {
    setIsRunning(true)
    setIsPaused(false)
    setCurrentPhase("focus")
    setCurrentRepetition(1)
    setTimeRemaining(focusTime * 60)
  }

  const pauseTimer = () => {
    setIsPaused(true)
  }

  const resumeTimer = () => {
    setIsPaused(false)
  }

  const stopTimer = () => {
    setIsRunning(false)
    setIsPaused(false)
    setTimeRemaining(focusTime * 60)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTaskTitle,
          category: newTaskCategory,
          completed: false,
          subtasks: [],
        },
      ])
      setNewTaskTitle("")
    }
  }

  const addSubtask = (taskId: string, subtaskTitle: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: [
                ...task.subtasks,
                { id: Date.now().toString(), title: subtaskTitle, completed: false },
              ],
            }
          : task
      )
    )
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, subtasks: task.subtasks.map((st) => ({ ...st, completed: !task.completed })) }
          : task
      )
    )
  }

  const toggleSubtaskCompletion = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : task
      )
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: task.subtasks.filter((st) => st.id !== subtaskId) }
          : task
      )
    )
  }

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl font-sans">
      <div className="mb-8 bg-yellow-300 p-6 rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black transform rotate-1">
        <h2 className="text-4xl font-bold text-center mb-6 text-black">Pomodoro Timer</h2>
        {!isRunning ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="focusTime" className="text-lg font-bold">Focus Time (minutes)</Label>
                <Input
                  id="focusTime"
                  type="number"
                  value={focusTime}
                  onChange={(e) => setFocusTime(parseInt(e.target.value))}
                  min="1"
                  className="border-4 border-black rounded-md p-2 text-xl font-bold bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pauseTime" className="text-lg font-bold">Pause Time (minutes)</Label>
                <Input
                  id="pauseTime"
                  type="number"
                  value={pauseTime}
                  onChange={(e) => setPauseTime(parseInt(e.target.value))}
                  min="1"
                  className="border-4 border-black rounded-md p-2 text-xl font-bold bg-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="repetitions" className="text-lg font-bold">Number of Repetitions</Label>
              <Input
                id="repetitions"
                type="number"
                value={repetitions}
                onChange={(e) => setRepetitions(parseInt(e.target.value))}
                min="1"
                className="border-4 border-black rounded-md p-2 text-xl font-bold bg-white"
              />
            </div>
            <Button onClick={startNewSession} className="w-full bg-green-400 text-black border-4 border-black rounded-md p-2 text-xl font-bold hover:bg-green-500 transform hover:-translate-y-1 transition-transform duration-200">
              Start New Session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold">
                {currentPhase === "focus" ? "Focus Time" : "Pause Time"}
              </h2>
              <p className="text-xl">
                Repetition {currentRepetition} of {repetitions}
              </p>
            </div>
            <div className="text-6xl font-bold text-center bg-white border-4 border-black rounded-md p-4 transform -rotate-1">
              {formatTime(timeRemaining)}
            </div>
            <div className="flex justify-center space-x-4">
              {isPaused ? (
                <Button onClick={resumeTimer} className="bg-blue-400 text-black border-4 border-black rounded-md p-2 text-xl font-bold hover:bg-blue-500 transform hover:-translate-y-1 transition-transform duration-200">Resume</Button>
              ) : (
                <Button onClick={pauseTimer} className="bg-yellow-400 text-black border-4 border-black rounded-md p-2 text-xl font-bold hover:bg-yellow-500 transform hover:-translate-y-1 transition-transform duration-200">Pause</Button>
              )}
              <Button onClick={stopTimer} className="bg-red-400 text-black border-4 border-black rounded-md p-2 text-xl font-bold hover:bg-red-500 transform hover:-translate-y-1 transition-transform duration-200">
                Stop
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-pink-300 p-6 rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black transform -rotate-1">
        <h2 className="text-4xl font-bold mb-6 text-black">To-Do List</h2>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Add a new task"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              className="border-4 border-black rounded-md p-2 text-xl font-bold bg-white flex-grow"
            />
            <Select value={newTaskCategory} onValueChange={(value: "chores" | "work" | "sport" | "relax") => setNewTaskCategory(value)}>
              <SelectTrigger className="w-[180px] border-4 border-black rounded-md p-2 text-xl font-bold bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chores">Chores</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="sport">Sport</SelectItem>
                <SelectItem value="relax">Relax</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addTask} className="bg-green-400 text-black border-4 border-black rounded-md p-2 text-xl font-bold hover:bg-green-500 transform hover:-translate-y-1 transition-transform duration-200">
              <PlusCircle className="w-6 h-6 mr-2" />
              Add
            </Button>
          </div>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border-4 border-black rounded-lg p-4 bg-white transform rotate-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="border-4 border-black rounded-md w-6 h-6"
                    />
                    <span className={`text-xl font-bold ${task.completed ? "line-through" : ""}`}>{task.title}</span>
                    <span className="text-lg font-bold text-gray-600">({task.category})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskExpansion(task.id)}
                      className="border-2 border-black rounded-md hover:bg-gray-200"
                    >
                      {expandedTasks.includes(task.id) ? (
                        <ChevronDown className="w-6 h-6" />
                      ) : (
                        <ChevronRight className="w-6 h-6" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="border-2 border-black rounded-md hover:bg-gray-200"
                    >
                      <Trash2 className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
                {expandedTasks.includes(task.id) && (
                  <div className="mt-4 pl-8 space-y-2">
                    {task.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={() => toggleSubtaskCompletion(task.id, subtask.id)}
                            className="border-2 border-black rounded-md w-4 h-4"
                          />
                          <span className={`text-lg ${subtask.completed ? "line-through" : ""}`}>
                            {subtask.title}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSubtask(task.id, subtask.id)}
                          className="border-2 border-black rounded-md hover:bg-gray-200"
                        >
                          
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a subtask"
                        className="border-2 border-black rounded-md p-2 text-lg bg-white flex-grow"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const input = e.target as HTMLInputElement
                            addSubtask(task.id, input.value)
                            input.value = ""
                          }
                        }}
                      />
                      <Button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          addSubtask(task.id, input.value)
                          input.value = ""
                        }}
                        className="bg-blue-400 text-black border-2 border-black rounded-md p-2 text-lg font-bold hover:bg-blue-500 transform hover:-translate-y-1 transition-transform duration-200"
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}