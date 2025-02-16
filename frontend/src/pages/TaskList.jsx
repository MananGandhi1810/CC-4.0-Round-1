import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const priorities = {
    high: { label: "High", color: "bg-red-500" },
    medium: { label: "Medium", color: "bg-yellow-500" },
    low: { label: "Low", color: "bg-green-500" },
};

const statusOptions = [
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
];

export default function TaskList() {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            parsedTasks.forEach(
                (task) => (task.dueDate = new Date(task.dueDate)),
            );
            return parsedTasks;
        } else {
            return [];
        }
    });
    const [newTaskDesc, setNewTaskDesc] = useState("");

    useEffect(() => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            parsedTasks.forEach(
                (task) => (task.dueDate = new Date(task.dueDate)),
            );
            setTasks(parsedTasks);
        } else {
            setTasks([]);
        }
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const updateTask = (taskId, field, value) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, [field]: value } : task,
            ),
        );
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTaskDesc.trim()) return;

        const newTask = {
            id: Date.now(),
            description: newTaskDesc,
            status: "not_started",
            dueDate: new Date(),
            priority: "medium",
        };

        setTasks([...tasks, newTask]);
        setNewTaskDesc("");
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    return (
        <div className="p-16 space-y-4">
            <form onSubmit={addTask} className="flex gap-2">
                <Input
                    placeholder="Enter new task description"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                </Button>
            </form>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-72">Status</TableHead>
                        <TableHead className="w-56">Due Date</TableHead>
                        <TableHead className="w-72">Priority</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell>{task.description}</TableCell>
                            <TableCell>
                                <Select
                                    value={task.status}
                                    onValueChange={(value) =>
                                        updateTask(task.id, "status", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline">
                                            {format(task.dueDate, "PPP")}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Calendar
                                            mode="single"
                                            selected={task.dueDate}
                                            onSelect={(date) =>
                                                updateTask(
                                                    task.id,
                                                    "dueDate",
                                                    date,
                                                )
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={task.priority}
                                    onValueChange={(value) =>
                                        updateTask(task.id, "priority", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-3 h-3 rounded-full ${
                                                    priorities[task.priority]
                                                        .color
                                                }`}
                                            />
                                            <SelectValue />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(priorities).map(
                                            ([value, { label, color }]) => (
                                                <SelectItem
                                                    key={value}
                                                    value={value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {label}
                                                    </div>
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteTask(task.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
