import About from "@/components/about";
import Aesthetic from "@/components/aesthetic";
import Banner from "@/components/banner";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import Plan from "@/components/plan";
import Testimonial from "@/components/testimonial";

export default function Home(){
  console.log(process.env.NEXT_PUBLIC_NODE_ENV);
  
  return (
   <section className="w-screen overflow-x-hidden relative">
      <Nav />
      <Banner /><Aesthetic size="text-[200px] sm:text-[400px]" position="left-[20%] top-20" />
      <About /><Aesthetic size="sm:text-[400px] text-[200px] " position="left-[10%] top-[600px]" />
      <Plan />
      <Testimonial />
      <Footer />
   </section>
  );
}