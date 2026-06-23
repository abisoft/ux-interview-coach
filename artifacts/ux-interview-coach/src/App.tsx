import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Nav } from "@/components/Nav";
import { Home } from "@/pages/Home";
import { Interview } from "@/pages/Interview";
import { Quiz } from "@/pages/Quiz";
import { Saved } from "@/pages/Saved";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/interview" component={Interview} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/saved" component={Saved} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
