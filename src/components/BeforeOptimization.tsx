import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Unoptimized child components - will re-render on every parent state change
const UserCard = ({
  user,
  onEdit,
}: {
  user: any;
  onEdit: (id: string) => void;
}) => {
  console.log(" UserCard re-rendered");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-col">
            {" "}
            <Badge variant="secondary">{user.role}</Badge>
            <div className="text-sm text-muted-foreground">
              Age: {user.age}
            </div>
          </div>

          <Button size="sm" onClick={() => onEdit(user.id)}>
            Edit User
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const StatsCard = ({
  title,
  value,
  description,
  onEdit,
}: {
  title: string;
  value: number;
    description: string;
  onEdit: () => void;
}) => {
  console.log("StatsCard re-rendered");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
           <div className="flex items-center justify-between">
          <div className="flex-col">
         <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
          </div>

          <Button size="sm" onClick={() => onEdit()}>
            Edit salary
          </Button>
        </div>
       
      </CardContent>
    </Card>
  );
};

const HeavyChartComponent = ({ data }: { data: number[] }) => {
  console.log("HeavyChartComponent re-rendered - expensive operation!");

  // Simulate expensive computation
  console.log(" Heavy computation running...");
  const processedData = data.map((value) => {
    // Simulate heavy processing
    let result = value;
    for (let i = 0; i < 10; i++) {
      result = Math.sin(result) + Math.cos(result);
    }
    return Math.round(value * 1.2);
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Heavy Chart Component</CardTitle>
        <CardDescription>
          This component does expensive calculations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-32 bg-muted rounded flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold">Chart Data</div>
            <div className="text-sm text-muted-foreground">
              Processed: [{processedData.slice(0, 3).join(", ")}...]
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Unoptimized parent component
export const BeforeOptimization = () => {
  const [counter, setCounter] = useState(0);
  const [user, setUser] = useState({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    age: 30,
  });
  const [salary, setSalary] = useState(50000);

  // This function will be recreated on every render
  const handleEditUser = (userId: string) => {
    console.log("Editing user:", userId);
    setUser((prev) => ({ ...prev, age: user.age + 5 }));
  };
  // This function will be recreated on every render
  const handleEditSalary = () => {
    console.log("Editing salary for user");
    setSalary((prev) => prev + 1000);
  };

  // This array will be recreated on every render
  const chartData = [10, 20, 30, 40, 50];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Before Optimization</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Counter: {counter}
          </span>
          <Button onClick={() => setCounter((prev) => prev + 1)}>
            Increment Counter
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        Open browser console to see re-render logs. Click "Increment Counter" to
        see all components re-render.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UserCard user={user} onEdit={handleEditUser} />

       

        <StatsCard
          title="Revenue"
          value={salary}
          description="Total revenue this quarter"
          onEdit={handleEditSalary} 
        />
      </div>

      <div className="mt-6">
        <HeavyChartComponent data={chartData} />
      </div>
    </div>
  );
};
