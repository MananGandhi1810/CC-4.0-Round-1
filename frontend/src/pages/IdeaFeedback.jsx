import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AuthContext from "@/providers/auth-context";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RadialBarChart, RadialBar } from "recharts";

function IdeaFeedback() {
    const [description, setDescription] = useState("");
    const [industry, setIndustry] = useState("");
    const [targetMarket, setTargetMarket] = useState("");
    const [usp, setUsp] = useState("");
    const [problemStatement, setProblemStatement] = useState("");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [openAccordion, setOpenAccordion] = useState(null);
    const { user } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            description,
            industry,
            usp,
            target_market: targetMarket,
            problem: problemStatement,
        };
        try {
            const response = await axios
                .post(`${process.env.SERVER_URL}/analyze_business_idea`, data, {
                    headers: { "Content-Type": "application/json" },
                })
                .then((res) => res.data);
            setAnalysis(response);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div className="p-10 md:h-full-w-nav flex md:flex-row flex-col items-center justify-center gap-10">
            <Card className="max-w-md w-full text-gray-100">
                <CardHeader>
                    <CardTitle>AI Enhanced Idea Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-1">
                            <Label className="text-gray-100">Problem:</Label>
                            <Textarea
                                className="text-gray-100 border border-gray-600 rounded-md p-2"
                                value={problemStatement}
                                onChange={(e) =>
                                    setProblemStatement(e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="text-gray-100">Industry:</Label>
                            <Input
                                type="text"
                                className="text-gray-100 border border-gray-600 rounded-md p-2"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="text-gray-100">
                                Description:
                            </Label>
                            <Textarea
                                className="text-gray-100 border border-gray-600 rounded-md p-2"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="text-gray-100">
                                Target Market:
                            </Label>
                            <Input
                                type="text"
                                className="text-gray-100 border border-gray-600 rounded-md p-2"
                                value={targetMarket}
                                onChange={(e) =>
                                    setTargetMarket(e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="text-gray-100">
                                Unique Selling Proposition:
                            </Label>
                            <Input
                                type="text"
                                className="text-gray-100 border border-gray-600 rounded-md p-2"
                                value={usp}
                                onChange={(e) => setUsp(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full transition-colors"
                            disabled={
                                !usp ||
                                !targetMarket ||
                                !problemStatement ||
                                !industry ||
                                !description ||
                                loading
                            }
                        >
                            {loading && (
                                <Loader2 className="animate-spin mr-2" />
                            )}
                            {loading ? "Evaluating..." : "Evaluate"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            {analysis && (
                <div className="flex-1 space-y-4 flex flex-col align-middle items-center justify-center">
                    <div className="flex flex-row gap-4">
                        <Card className="rounded-lg shadow-xl bg-gray-800 text-gray-100">
                            <CardHeader>
                                <CardTitle className="capitalize">
                                    Analysis Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-100">
                                    {analysis.reasoning}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-lg shadow-xl bg-gray-800 text-gray-100">
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <RadialBarChart
                                    width={200}
                                    height={200}
                                    cx={100}
                                    cy={100}
                                    innerRadius={60}
                                    outerRadius={80}
                                    barSize={10}
                                    data={[
                                        {
                                            name: "remaining",
                                            value: 100,
                                            fill: "transparent",
                                        },
                                        {
                                            name: "score",
                                            value: analysis.feasibility_score,
                                            fill:
                                                analysis.feasibility_score >= 70
                                                    ? "#4ade80"
                                                    : analysis.feasibility_score >=
                                                      40
                                                    ? "#facc15"
                                                    : "#f87171",
                                        },
                                    ]}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <RadialBar
                                        background={false}
                                        dataKey="value"
                                        cornerRadius={30}
                                    />
                                </RadialBarChart>
                                <div className="text-center mt-2">
                                    <span className="text-2xl font-bold">
                                        {analysis.feasibility_score}%
                                    </span>
                                    <p className="text-sm text-gray-400">
                                        Feasibility Score
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <ScrollArea className="w-full rounded-lg">
                        <div className="space-y-4">
                            {Object.entries(analysis)
                                .filter(
                                    ([key]) =>
                                        ![
                                            "reasoning",
                                            "feasibility_score",
                                        ].includes(key),
                                )
                                .map(([key, value]) => (
                                    <Collapsible
                                        key={key}
                                        open={openAccordion === key}
                                        onOpenChange={(open) =>
                                            setOpenAccordion(open ? key : null)
                                        }
                                    >
                                        <CollapsibleTrigger className="w-full px-4 py-2 bg-gray-700 text-gray-100 rounded-lg text-left capitalize">
                                            {key.replace("_", " ")}
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <Card className="mt-2 rounded-lg shadow-xl bg-gray-800 text-gray-100">
                                                <CardHeader>
                                                    <CardTitle className="capitalize">
                                                        {key.replace("_", " ")}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="list-disc pl-4 space-y-2">
                                                        {Array.isArray(value) &&
                                                            value.map(
                                                                (v, idx) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        {v}
                                                                    </li>
                                                                ),
                                                            )}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}

export default IdeaFeedback;

// {
//     "description": "A mobile app that connects local farmers directly with consumers to buy fresh, organic produce at fair prices.",
//     "industry": "Agriculture & E-commerce",
//     "target_market": "Health-conscious consumers, organic food enthusiasts, and urban residents looking for fresh farm produce",
//     "usp": "Eliminates middlemen, ensures fair pricing for farmers, and provides consumers with fresh, organic produce directly from local farms.",
//     "problem": "I am trying to bridge the gap between local farmers and consumers to provide them with fresh and organic produce at their doorstep"
// }
