import { Hero } from "@/components/custom/Hero";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Lightbulb, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router";

function Home() {
    return (
        <div className="flex flex-col">
            <section className="px-10 h-full-w">
                <Hero />
            </section>
            <section className="px-10 py-16 bg-gray-900">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12 text-gray-100">
                        Your Complete, End-to-End AI Co-Founder
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <Brain className="w-12 h-12 mx-auto text-blue-500" />
                                <CardTitle className="text-gray-100">
                                    AI-Powered Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-gray-300">
                                Get instant feedback on your business ideas
                                using advanced AI
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <Lightbulb className="w-12 h-12 mx-auto text-yellow-500" />
                                <CardTitle className="text-gray-100">
                                    Idea Validation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-gray-300">
                                Validate your business concepts with
                                comprehensive SWOT analysis
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <Target className="w-12 h-12 mx-auto text-green-500" />
                                <CardTitle className="text-gray-100">
                                    Market Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-gray-300">
                                Understand your target market and competitive
                                landscape
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <TrendingUp className="w-12 h-12 mx-auto text-purple-500" />
                                <CardTitle className="text-gray-100">
                                    Growth Strategy
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-gray-300">
                                Get actionable recommendations for business
                                growth
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="px-10 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8 text-gray-100">
                        Ready to Validate Your Business Idea?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Get started today and transform your business concept
                        into a solid plan
                    </p>
                    <Button size="lg" className="text-lg px-8" asChild>
                        <Link to="/idea-feedback">Start Now</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}

export default Home;
