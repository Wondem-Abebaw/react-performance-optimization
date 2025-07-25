import React, { lazy, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BeforeOptimization } from "@/components/BeforeOptimization";
// import { AfterOptimization } from "@/components/AfterOptimization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Lazy-loaded user edit modal
const AfterOptimization = lazy(() => import("../components/AfterOptimization"));

const Index = () => {


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Tabs defaultValue="before" className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              React Performance Optimization Demo
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Compare unoptimized vs optimized React components
            </p>

            <TabsList>
              <TabsTrigger value="before"> Before Optimization</TabsTrigger>
              <TabsTrigger value="after"> After Optimization</TabsTrigger>
            </TabsList>

        
          </div>

          <TabsContent value="before">
            <BeforeOptimization />
          </TabsContent>
          <TabsContent value="after">
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <AfterOptimization />
            </Suspense>
          </TabsContent>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Optimization Techniques Applied:
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                • <strong>React.memo:</strong> Prevents unnecessary re-renders
                of child components
              </li>
              <li>
                • <strong>useCallback:</strong> Stabilizes function references
                to prevent prop changes
              </li>
              <li>
                • <strong>useMemo:</strong> Memoizes expensive calculations and
                object/array creation
              </li>
              <li>
                • <strong>React.lazy + Suspense:</strong> Code-splits heavy
                components for better initial load performance
              </li>
            </ul>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
