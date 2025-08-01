import { Companies } from "@/components/Companies";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const CompaniesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <Companies />
      </div>
      <Footer />
    </div>
  );
};

export default CompaniesPage; 