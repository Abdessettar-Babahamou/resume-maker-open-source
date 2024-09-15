import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useAIGeneration = (chatSession: any) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWithAI = async (
    type: 'education' | 'project' | 'skill' | 'Certificate' | 'Job'|'Experience',
    title: string,
    description: string
  ) => {
    if (!title) {
      toast({
        description: `Please enter a ${type} title before generating.`,
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    try {
      const prompt = `I have a ${type} titled "${title}" with this description: "${description}". Based on this, please generate a concise 3-4 line summary for a CV in HTML format, excluding the HTML and body tags.please makee sure to give me better summary`;
      
      const result = await chatSession.sendMessage(prompt);
      const generatedContent = result.response.text();
      toast({
        description: `The AI ${type} description created.`,
        variant: "succsses",
      });
      return generatedContent;
    } catch (error) {
      console.error(`Error generating AI ${type} description:`, error);
      toast({
        description: `Failed to generate AI ${type} description. Please try again.`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateWithAI, isGenerating };
};