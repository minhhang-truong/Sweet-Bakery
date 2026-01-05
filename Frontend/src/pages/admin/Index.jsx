import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-8">
          <span className="text-6xl font-script text-secondary">Sweet Bakery</span>
        </div>
        <h1 className="mb-4 text-3xl font-bold text-foreground">
          Bakery Management System
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Select your role to continue
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/manager/dashboard")}
            className="bg-secondary text-secondary-foreground px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Manager Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
