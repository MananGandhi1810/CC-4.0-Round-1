import { Hero } from "@/components/custom/Hero";
import React from "react";

function Home() {
    return (
        <div>
            <section className="md:p-10 h-full-w-nav">
                <Hero />
            </section>
            <section>
                <p>Your Complete, End-to-End AI Co-Founder</p>
            </section>
        </div>
    );
}

export default Home;
