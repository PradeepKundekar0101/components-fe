import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { sources } from "@/data";
import { Check, SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";
import { sites } from "@/config";

const SourceFilterDialog = ({
  selectedSources,
  setSelectedSources,
}: {
  selectedSources: string[];
  setSelectedSources: (sources: string[]) => void;
}) => {
  const allowedSources = sites.filter((site) => site.isAllowed);
  const filteredSources = sources.filter((source) =>
    allowedSources.some((site) => site.name === source.id)
  );
  const toggleSource = (sourceId: string) => {
    setSelectedSources(
      selectedSources.includes(sourceId)
        ? selectedSources.filter((s) => s !== sourceId)
        : [...selectedSources, sourceId]
    );
  };

  const selectAll = () =>
    setSelectedSources(sources.map((source) => source.id));
  const clearAll = () => setSelectedSources([]);
  useEffect(() => {
    console.log(selectedSources);
  }, [selectedSources]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Sources
          {selectedSources.length < sources.length && (
            <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-1">
              {selectedSources.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Filter Sources
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-between mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              className="text-sm"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-sm"
            >
              Clear All
            </Button>
          </div>

          <div className="grid gap-3">
            {filteredSources.map((source) => (
              <div
                key={source.id}
                onClick={() => toggleSource(source.id)}
                className={`
                    flex items-center p-3 rounded-lg cursor-pointer
                    transition-all duration-200 ease-in-out
                    ${
                      selectedSources.includes(source.id)
                        ? "bg-red-50 border-2 border-red-500"
                        : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                    }
                  `}
              >
                <div className="flex-1 flex items-center gap-3">
                  <img
                    src={source.logo}
                    alt={source.label}
                    className={`h-8 w-24 object-contain rounded-md bg-white ${
                      source.id === "evelta" || source.id == "sunrom"
                        ? "bg-black"
                        : source.id === "robocraze"
                        ? "bg-white"
                        : source.id === "zbotic"
                        ? "bg-white"
                        : ""
                    }`}
                  />
                  <span className="font-medium text-gray-700">
                    {source.label}
                  </span>
                </div>
                <div
                  className={`
                    w-5 h-5 rounded-full flex items-center justify-center
                    ${
                      selectedSources.includes(source.id)
                        ? "bg-red-500 text-white"
                        : "border-2 border-gray-300"
                    }
                  `}
                >
                  {selectedSources.includes(source.id) && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SourceFilterDialog;
