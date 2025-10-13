import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useToast } from "../../components/ui/toast";
import { api } from "../../lib/api";
import MapPicker from "../../components/MapPicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

export default function CreateReport() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [mapOpen, setMapOpen] = useState(false);
  const [urgency, setUrgency] = useState("MEDIUM");
  const [mediaUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title.trim().length >= 3 && description.trim().length >= 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      let uploadedUrls: string[] = [];
      if (files && files.length > 0) {
        const result = await api.uploadFilesApi(Array.from(files));
        uploadedUrls = result.urls || [];
      }
      const created = await api.createReportApi({
        title: title.trim(),
        description: description.trim(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: category as any,
        address: address.trim() || undefined,
        latitude: latitude === "" ? undefined : Number(latitude),
        longitude: longitude === "" ? undefined : Number(longitude),
        mediaUrls: (uploadedUrls.length ? uploadedUrls : mediaUrls)
          .map((u) => u.trim())
          .filter((u) => u.length > 0),
        // @ts-expect-error backend will be updated to accept urgency
        urgency,
      });
      showToast("Report created successfully", { variant: "success" });
      // eslint-disable-next-line no-constant-binary-expression, @typescript-eslint/no-explicit-any
      navigate(`/reports/${(created as any).id ?? ""}` || "/reports", {
        replace: true,
      });
    } catch (e: unknown) {
      showToast((e as Error)?.message || "Failed to create report", {
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-start justify-center p-0">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>New Report</CardTitle>
          <CardDescription>Create a new issue report.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                className="w-full rounded-md border bg-background px-4 py-3 outline-none focus:ring-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address / Location name
                </label>
                <input
                  id="address"
                  className="w-full rounded-md border bg-background px-4 py-3 outline-none focus:ring-2"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g., Main Library, Block C"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Urgency</label>
                <select
                  className="w-full rounded-md border bg-background px-4 py-3 outline-none focus:ring-2"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={
                    typeof latitude === "number" &&
                    typeof longitude === "number"
                      ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                      : "No location selected"
                  }
                  className="flex-1 rounded-md border bg-muted px-4 py-3 text-sm"
                />
                <Dialog open={mapOpen} onOpenChange={setMapOpen}>
                  <DialogTrigger>
                    <Button type="button" variant="outline">
                      Pin on map
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogTitle>Select location</DialogTitle>
                    <DialogDescription>
                      Click on the map to drop a pin. Drag the marker to adjust.
                    </DialogDescription>
                    <div className="mt-2">
                      <MapPicker
                        center={
                          typeof latitude === "number" &&
                          typeof longitude === "number"
                            ? {
                                lat: latitude as number,
                                lng: longitude as number,
                              }
                            : undefined
                        }
                        onPick={(c) => {
                          setLatitude(c.lat);
                          setLongitude(c.lng);
                        }}
                        height="400px"
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={() => setMapOpen(false)}>
                        Done
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Images</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="block w-full rounded-md border bg-background px-4 py-3 text-sm"
              />
              {files && files.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  {files.length} file{files.length > 1 ? "s" : ""} selected
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                className="min-h-[120px] w-full rounded-md border bg-background px-4 py-3 outline-none focus:ring-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                className="w-full rounded-md border bg-background px-4 py-3 outline-none focus:ring-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="IT">IT</option>
                <option value="SECURITY">Security</option>
                <option value="INFRASTRUCTURE">Infrastructure</option>
                <option value="SANITATION">Sanitation</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="WATER">Water</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <Button
              type="submit"
              disabled={!canSubmit || submitting}
              className="w-full"
            >
              {submitting ? "Creating..." : "Create report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
