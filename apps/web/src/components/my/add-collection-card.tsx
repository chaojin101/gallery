import { backend } from "@/backend";
import NewCollectionFormBtn from "@/components/my/new-collection-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/useAuth";
import { queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";

type Props = {
  selectedImgIds: string[];
};

export const AddCollectionCard = (props: Props) => {
  const { authHeader } = useAuth();

  if (!authHeader) {
    console.log("not authenticated");
    return null;
  }

  const q = useQuery({
    queryKey: ["addCollectionCard"],
    queryFn: async () => {
      return await backend.api.v1.collections.addCollectionCard.get({
        headers: authHeader,
      });
    },
  });

  const appendM = useMutation({
    mutationFn: async (options: {
      amount: number;
      collectionId: string;
      imgIds: string[];
    }) => {
      return await backend.api.v1.collections.appendToCollection.post(
        { ...options },
        { headers: authHeader }
      );
    },
  });

  console.log(props);

  const handleAppend = async (options: {
    collectionId: string;
    amount: number;
    name: string;
  }) => {
    const r = await appendM.mutateAsync({
      collectionId: options.collectionId,
      amount: options.amount,
      imgIds: props.selectedImgIds,
    });

    if (!r.data?.base.success) {
      toast({
        title: "Something went wrong",
      });
    }

    await queryClient.invalidateQueries({ queryKey: ["addCollectionCard"] });

    toast({
      title: "Success",
      description: `${props.selectedImgIds.length} Img(s) added to ${options.name}`,
    });
  };

  return (
    <header className="flex flex-col gap-2">
      <Card className="max-w-[600px]" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>Save imgs to...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {q.isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col gap-2">
              {q.data?.data?.data.collections.map((c) => (
                <div
                  className="px-2 border rounded-s"
                  onClick={() =>
                    handleAppend({
                      collectionId: c.id,
                      name: c.name,
                      amount: c.amount,
                    })
                  }
                  key={c.id}
                >
                  {`${c.name} (${c.amount})`}
                </div>
              ))}
            </div>
          )}
          <NewCollectionFormBtn />
        </CardContent>
      </Card>
    </header>
  );
};
