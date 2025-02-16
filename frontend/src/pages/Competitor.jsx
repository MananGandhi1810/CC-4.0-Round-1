import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ExternalLink } from "lucide-react";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Markdown from "react-markdown";

function Competitor() {
    const [idea, setIdea] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [openCompetitor, setOpenCompetitor] = useState(null);

    const dummyData = {
        competitors: [
            {
                url: "https://germanwithlaura.com/noun-cases/",
                analysis:
                    'Company Name: German With Laura\n\nDescription: German With Laura offers online German language instruction, focusing on grammar, specifically German noun cases. The content aims to demystify complex grammatical concepts for English speakers.\n\nUnique Selling Points (USPs):\n* Focus on German noun cases\n* Comparison to English grammar\n* Clear and simple explanations\n* "Shortcuts" and special exceptions\n* Fact-checked content',
            },
            {
                url: "https://www.belkin.com/products/product-resources/screen-protector-buying-guide/",
                analysis:
                    "Company Name: Belkin\n\nDescription: Belkin sells a wide range of electronic accessories, including screen protectors, wireless chargers, cables, adapters, and more.\n\nUnique Selling Points (USPs):\n* Wide range of products\n* Brand recognition\n* Specific device compatibility\n* Belkin Rewards program",
            },
        ],
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API call with 1 second delay
            // const response = await axios.post(
            //     `${process.env.SERVER_URL}/competitors`,
            //     { idea },
            //     {
            //         headers: { "Content-Type": "application/json" },
            //     },
            // );
            // setAnalysis(response.data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setAnalysis(dummyData);
        } catch (error) {
            console.error("Error analyzing competitors:", error);
        }
        setLoading(false);
    };

    return (
        <div className="p-10 h-full-w-nav flex flex-col md:flex-row items-center justify-center gap-10">
            <Card className="w-full max-w-xl text-gray-100">
                <CardHeader>
                    <CardTitle>Tell us about your business idea</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-100">
                                Describe your business idea in detail
                            </Label>
                            <Textarea
                                placeholder="Example: I want to create a mobile app that connects local farmers with consumers for fresh produce delivery..."
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                className="h-32 text-gray-100 border border-gray-600"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!idea.trim() || loading}
                        >
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {loading ? "Analyzing..." : "Analyze Competitors"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            {analysis && (
                <div className="w-full max-w-4xl">
                    <div className="space-y-4">
                        {analysis.competitors.map((competitor, index) => (
                            <Collapsible
                                key={index}
                                open={openCompetitor === index}
                                onOpenChange={(open) =>
                                    setOpenCompetitor(open ? index : null)
                                }
                            >
                                <CollapsibleTrigger className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg text-left flex items-center justify-between">
                                    <span>Competitor {index + 1}</span>
                                    <a
                                        href={competitor.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Visit Site
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="w-full">
                                    <Card className="mt-2 bg-gray-800 text-gray-100">
                                        <CardContent className="pt-4">
                                            <ScrollArea className="h-[400px]">
                                                <Markdown className="prose dark:prose-invert min-w-full">
                                                    {competitor.analysis}
                                                </Markdown>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Competitor;
