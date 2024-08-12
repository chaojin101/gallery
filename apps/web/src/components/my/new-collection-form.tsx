import { backend } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/useAuth";
import {
  COLLECTION_DESCRIPTION_MAX_LENGTH,
  COLLECTION_DESCRIPTION_MIN_LENGTH,
  COLLECTION_NAME_MAX_LENGTH,
  COLLECTION_NAME_MIN_LENGTH,
} from "@gallery/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const newCollectionForm = z.object({
  name: z
    .string()
    .min(COLLECTION_NAME_MIN_LENGTH)
    .max(COLLECTION_NAME_MAX_LENGTH),
  description: z
    .string()
    .min(COLLECTION_DESCRIPTION_MIN_LENGTH)
    .max(COLLECTION_DESCRIPTION_MAX_LENGTH),
});

type NewCollectionForm = z.infer<typeof newCollectionForm>;

const NewCollectionFormBtn = () => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewCollectionForm>({
    resolver: zodResolver(newCollectionForm),
  });

  const { tokenPayload, authHeader } = useAuth();

  const newCollectionM = useMutation({
    mutationFn: async (options: { name: string; description: string }) => {
      return await backend.api.v1.collections.index.post(options, {
        headers: authHeader!,
      });
    },
  });

  const onSubmit = async (data: NewCollectionForm) => {
    const result = await newCollectionM.mutateAsync(data);

    if (!result.data?.base.success) {
      toast({ title: result.data?.base.msg });
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Create a new collection</DialogTitle>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="name" {...register("name")} />
              {errors.name && (
                <div className="pl-1 text-red-400 text-xs">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">description</Label>
              <Input
                id="description"
                type="description"
                placeholder="description"
                {...register("description")}
              />
              {errors.description && (
                <div className="pl-1 text-red-400 text-xs">
                  {errors.description.message}
                </div>
              )}
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={newCollectionM.isPending}
          >
            {newCollectionM.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}{" "}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewCollectionFormBtn;
