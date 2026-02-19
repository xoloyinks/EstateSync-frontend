import About from "@/components/about";
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
      <Banner />
      <About />
      <Testimonial />
      <Plan />
      <Footer />
   </section>
  );
}