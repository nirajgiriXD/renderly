/**
 * Internal dependencies.
 */
import { useStore } from "@/hooks";

export const PreviewSection = () => {
  const { form, categoryTab, configurationTab } = useStore();

  return (
    <div className="h-full w-full px-4 sm:px-6">
      <div className="flex items-center justify-center h-full w-full border rounded-lg">
        <pre>
          {JSON.stringify(
            form[categoryTab][
              configurationTab as keyof (typeof form)[typeof categoryTab]
            ],
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};
