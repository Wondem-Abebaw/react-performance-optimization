import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy-loaded heavy component
const LazyHeavyChartComponent = lazy(() => 
  // Simulate loading delay
  new Promise<{ default: React.ComponentType<{ data: number[] }> }>(resolve => {
    setTimeout(() => {
      resolve({
        default: ({ data }: { data: number[] }) => {
          console.log(' LazyHeavyChartComponent rendered');
          
          // Simulate expensive computation (memoized)
          const processedData = useMemo(() => {
            console.log(' Heavy computation running...');
            return data.map(value => {
              let result = value;
              for (let i = 0; i < 10; i++) {
                result = Math.sin(result) + Math.cos(result);
              }
              return Math.round(value * 1.2);
            });
          }, [data]);
          
          return (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Optimized Heavy Chart Component</CardTitle>
                <CardDescription>Lazy-loaded with memoized calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-semibold">Chart Data</div>
                    <div className="text-sm text-muted-foreground">
                      Processed: [{processedData.slice(0, 3).join(', ')}...]
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }
      });
    }, 1000);
  })
);

// Optimized child components wrapped with React.memo
const UserCard = React.memo(({ user, onEdit }: { user: any; onEdit: (id: string) => void }) => {
  console.log(' UserCard re-rendered (only when props change)');
  
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
});

const StatsCard = React.memo(({ title, value, description ,onEdit}: { title: string; value: number; description: string,  onEdit: () => void; }) => {
  console.log('🟢 StatsCard re-rendered (only when props change)');
  
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
});

// Loading skeleton for the lazy component
const ChartSkeleton = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-64" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-32 w-full" />
    </CardContent>
  </Card>
);

// Optimized parent component
const AfterOptimization = () => {
  const [counter, setCounter] = useState(0);
  
  // Memoized user object - won't change unless dependencies change
  const [user, setUser] = useState({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    age: 30,
  });
  
  const [salary, setSalary] = useState(50000);

  // This function will be recreated on every render
  const handleEditUser = useCallback((userId: string) => {
    console.log("Editing user:", userId);
    setUser((prev) => ({ ...prev, age: user.age + 5 }));
  },[user.age])

  // Using useCallback to memoize the function
  // This prevents unnecessary re-renders of UserCard and StatsCard
  
  const handleEditSalary =useCallback( () => {
    console.log("Editing salary for user");
    setSalary((prev) => prev + 1000);
  },[salary])
  
  // Memoized chart data - won't recreate on every render
  const chartData = useMemo(() => [10, 20, 30, 40, 50], []);
  
  // Memoized stats that don't depend on counter
  const stats = useMemo(() => [
    { title: "Total Users", value: 1234, description: "Active users this month" },
    { title: "Revenue", value: 5678, description: "Total revenue this quarter" }
  ], []);
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">After Optimization</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Counter: {counter}</span>
          <Button onClick={() => setCounter(prev => prev + 1)}>
            Increment Counter
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mb-4">
        Open browser console to see optimized re-render logs. Click "Increment Counter" - only the counter updates!
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
        <Suspense fallback={<ChartSkeleton />}>
          <LazyHeavyChartComponent data={chartData} />
        </Suspense>
      </div>
    </div>
  );
};
export default AfterOptimization;