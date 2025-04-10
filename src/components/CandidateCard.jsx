
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Award } from "lucide-react";

const CandidateCard = ({ candidate }) => {
  const matchScoreColor = () => {
    if (candidate.matchScore >= 90) return "text-green-500";
    if (candidate.matchScore >= 80) return "text-emerald-500";
    if (candidate.matchScore >= 70) return "text-amber-500";
    return "text-orange-500";
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border border-border">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 p-6 flex flex-col items-center justify-center bg-muted/30">
            <div className="relative">
              <img
                src={candidate.image}
                alt={candidate.name}
                className="h-24 w-24 rounded-full object-cover border-2 border-raya-purple/30"
              />
              <div className={`absolute -bottom-2 -right-2 bg-background border border-border rounded-full px-2 py-1 text-xs font-semibold ${matchScoreColor()}`}>
                {candidate.matchScore}% Match
              </div>
            </div>
            <h3 className="mt-4 font-semibold text-center">{candidate.name}</h3>
          </div>
          
          <div className="md:w-3/4 p-6">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-raya-purple" />
                  {candidate.title}
                </h4>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {candidate.location}
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex items-start">
                <Award className="h-4 w-4 mr-1 text-raya-purple" />
                <span className="text-sm">{candidate.experience} experience</span>
              </div>
            </div>
            
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Skills</h5>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="text-raya-purple hover:text-raya-purple/80 text-sm font-medium">
                View Full Profile
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
