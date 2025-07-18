import { useState } from "react";
import { Plus, Search, Filter, CheckCircle2, Circle, Trash2, Edit3, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  category: string;
  dueDate?: string;
  createdAt: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Hoàn thành báo cáo dự án",
    description: "Viết báo cáo chi tiết về tiến độ dự án Q4",
    completed: false,
    priority: "high",
    category: "Công việc",
    dueDate: "2024-01-20",
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    title: "Mua sắm thực phẩm",
    description: "Mua rau củ, thịt cá cho tuần này",
    completed: true,
    priority: "medium",
    category: "Cá nhân",
    dueDate: "2024-01-18",
    createdAt: "2024-01-14"
  },
  {
    id: "3",
    title: "Học React Native",
    description: "Hoàn thành khóa học online về React Native",
    completed: false,
    priority: "low",
    category: "Học tập",
    createdAt: "2024-01-10"
  }
];

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(true);

  const categories = ["all", ...Array.from(new Set(tasks.map(task => task.category)))];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || task.category === filterCategory;
    const matchesCompleted = showCompleted || !task.completed;
    
    return matchesSearch && matchesCategory && matchesCompleted;
  });

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high": return "Cao";
      case "medium": return "Trung bình";
      case "low": return "Thấp";
      default: return priority;
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-primary-foreground">
            <h1 className="text-4xl font-bold mb-2 animate-slide-in">Task Manager</h1>
            <p className="text-lg opacity-90 animate-slide-up">Quản lý công việc hiệu quả</p>
            <div className="mt-6 flex justify-center gap-8 animate-scale-in">
              <div className="text-center">
                <div className="text-3xl font-bold">{totalCount}</div>
                <div className="text-sm opacity-80">Tổng task</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success-foreground">{completedCount}</div>
                <div className="text-sm opacity-80">Hoàn thành</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning-foreground">{totalCount - completedCount}</div>
                <div className="text-sm opacity-80">Còn lại</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "Tất cả" : category}
                </option>
              ))}
            </select>
            
            <Button
              variant={showCompleted ? "default" : "outline"}
              onClick={() => setShowCompleted(!showCompleted)}
              className="shrink-0"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showCompleted ? "Ẩn hoàn thành" : "Hiện tất cả"}
            </Button>

            <Button className="shrink-0 bg-gradient-primary hover:shadow-glow transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Thêm task
            </Button>
          </div>
        </div>

        {/* Task List */}
        <div className="grid gap-4">
          {filteredTasks.map((task, index) => (
            <Card 
              key={task.id} 
              className={cn(
                "shadow-soft hover:shadow-elegant transition-all duration-300 animate-slide-in border-l-4",
                task.completed ? "opacity-75 border-l-success" : "border-l-primary",
                task.priority === "high" && !task.completed && "border-l-destructive"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="h-5 w-5"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-semibold text-lg mb-1 transition-all duration-200",
                          task.completed && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className={cn(
                            "text-muted-foreground mb-3",
                            task.completed && "line-through"
                          )}>
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="bg-gradient-secondary">
                            <Tag className="h-3 w-3 mr-1" />
                            {task.category}
                          </Badge>
                          
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>

                          {task.dueDate && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTasks.length === 0 && (
            <Card className="shadow-soft animate-scale-in">
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Không có task nào</h3>
                  <p>Hãy tạo task đầu tiên của bạn!</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;