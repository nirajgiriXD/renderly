/**
 * External dependencies.
 */
import {
  type ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Internal dependencies.
 */
import { AppContext } from "@/store/contexts/AppContext";
import { TABS, DEFAULT_CONFIG, SETTINGS } from "@/constants";
import type { DefaultConfig, SettingsType } from "@/types";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ref to track if local storage is enabled for saving data.
  const saveOnLocalStorage = useRef(
    localStorage.getItem("saveOnLocalStorage")
      ? localStorage.getItem("saveOnLocalStorage") === "true"
      : SETTINGS.saveOnLocalStorage
  );

  // Ref to avoid running certain effects on initial mount.
  const isLocalStorageMounted = useRef(false);

  // State for managing application settings.
  const [settings, setSettings] = useState(structuredClone(SETTINGS));

  // State for managing the form data.
  const [form, setForm] = useState<DefaultConfig>(
    structuredClone(DEFAULT_CONFIG)
  );

  // State for managing tabs category.
  const [categoryTab, setCategoryTab] = useState<keyof typeof TABS>(() => {
    let category = searchParams.get("category");
    category =
      category && category in TABS
        ? category
        : (Object.keys(TABS)[0] as keyof typeof TABS);
    return category as keyof typeof TABS;
  });

  // State for managing configuration tab.
  const [configurationTab, setConfigurationTab] = useState<string>(() => {
    let option = searchParams.get("configuration");
    option =
      option && TABS[categoryTab].includes(option)
        ? option
        : TABS[categoryTab][0];
    return option || "apps";
  });

  /**
   * Handle category tab change.
   * @param tab - The new category tab.
   */
  const handleCategoryTabChange = (tab: keyof typeof TABS) => {
    setCategoryTab(
      tab in TABS ? tab : (Object.keys(TABS)[0] as keyof typeof TABS)
    );
    setConfigurationTab((prev) =>
      TABS[tab].includes(prev) ? prev : TABS[tab][0]
    );
  };

  /**
   * Handle configuration tab change.
   * @param tab - The new configuration tab.
   */
  const handleConfigurationTabChange = (tab: string) => {
    setConfigurationTab(
      TABS[categoryTab].includes(tab) ? tab : TABS[categoryTab][0]
    );
  };

  /**
   * Handle form data change.
   * @param key - The key of the form data to change.
   * @param value - The new value to set for the specified key.
   */
  const handleFormChange = useCallback(
    <
      Tab extends keyof typeof TABS,
      Config extends keyof DefaultConfig[Tab],
      K extends keyof DefaultConfig[Tab][Config],
    >(
      key: K,
      value: DefaultConfig[Tab][Config][K]
    ) => {
      setForm((prev) => ({
        ...prev,
        [categoryTab]: {
          ...prev[categoryTab],
          [configurationTab]: {
            ...prev[categoryTab][
              configurationTab as keyof (typeof prev)[typeof categoryTab]
            ],
            [key]: value,
            // If multiple selection is being disabled, deselect all apps.
            ...(key === "enableMultipleSelection" && value === "disable"
              ? {
                  selectedApps: Object.keys(
                    prev[categoryTab].apps.selectedApps
                  ).reduce(
                    (acc, app) => {
                      acc[app] = false;
                      return acc;
                    },
                    {} as Record<string, boolean>
                  ),
                }
              : {}),
          },
        },
      }));
    },
    [categoryTab, configurationTab]
  );

  /**
   * Handle app toggle in the apps configuration.
   * @param appName - The value of the app to toggle.
   * @param checked - The new checked state of the app.
   */
  const handleAppToggle = useCallback(
    (appName: string, checked: boolean) => {
      if (form[categoryTab].apps.enableMultipleSelection === "enable") {
        // multi-select: simply toggle the value
        handleFormChange("selectedApps", {
          ...form[categoryTab].apps.selectedApps,
          [appName]: checked,
        });
      } else {
        // single-select: only one true at a time
        const next = Object.keys(form[categoryTab].apps.selectedApps).reduce(
          (acc, key) => {
            acc[key] = key === appName ? checked : false;
            return acc;
          },
          {} as Record<string, boolean>
        );

        handleFormChange("selectedApps", next);
      }
    },
    [categoryTab, form, handleFormChange]
  );

  /**
   * Handle settings change.
   * @param key - The key of the setting to change.
   * @param value - The new value to set for the specified key.
   */
  const handleSettingsChange = useCallback(
    <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
      if (key === "saveOnLocalStorage") {
        saveOnLocalStorage.current = value;
        localStorage.setItem("saveOnLocalStorage", value ? "true" : "false");
      }
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Sync URL search params when tabs change.
  useEffect(() => {
    setSearchParams({
      category: categoryTab,
      configuration: configurationTab,
    });
  }, [categoryTab, configurationTab, setSearchParams]);

  // Initialize settings from ref on mount.
  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      saveOnLocalStorage: saveOnLocalStorage.current,
    }));
  }, []);

  // Load form data from local storage if enabled.
  useEffect(() => {
    const mountLocalStorageData = () => {
      const postsCategoryData = localStorage.getItem("postsCategoryData");
      const commentsCategoryData = localStorage.getItem("commentsCategoryData");
      const messagesCategoryData = localStorage.getItem("messagesCategoryData");
      const aiChatsCategoryData = localStorage.getItem("aiChatsCategoryData");
      if (
        postsCategoryData &&
        commentsCategoryData &&
        messagesCategoryData &&
        aiChatsCategoryData
      ) {
        const appData = {
          posts: JSON.parse(postsCategoryData),
          comments: JSON.parse(commentsCategoryData),
          messages: JSON.parse(messagesCategoryData),
          "ai-chats": JSON.parse(aiChatsCategoryData),
        };
        setForm((prev) => ({ ...prev, ...appData }));
        isLocalStorageMounted.current = true;
      }
    };

    if (saveOnLocalStorage.current && !isLocalStorageMounted.current) {
      mountLocalStorageData();
    }
  }, []);

  // Save form data to local storage on change if enabled.
  useEffect(() => {
    if (saveOnLocalStorage.current) {
      localStorage.setItem(
        "aiChatsCategoryData",
        JSON.stringify(form["ai-chats"])
      );

      // Do not save profile picture to local storage.
      const commentsData = {
        ...form.comments,
        users: {
          ...form.comments.users,
          creator: {
            ...form.comments.users.creator,
            profilePicture: "",
          },
          commentors: form.comments.users.commentors.map((commentor) => ({
            ...commentor,
            profilePicture: "",
          })),
        },
      };
      localStorage.setItem(
        "commentsCategoryData",
        JSON.stringify(commentsData)
      );

      // Do not save profile picture to local storage.
      const messagesData = {
        ...form.messages,
        users: {
          ...form.messages.users,
          sender: {
            ...form.messages.users.sender,
            profilePicture: "",
          },
          receiver: {
            ...form.messages.users.receiver,
            profilePicture: "",
          },
        },
      };
      localStorage.setItem(
        "messagesCategoryData",
        JSON.stringify(messagesData)
      );

      // Do not save profile picture and media to local storage.
      const postsData = {
        ...form.posts,
        author: {
          ...form.posts.author,
          profilePicture: "",
        },
        content: {
          ...form.posts.content,
          media: "",
        },
      };
      localStorage.setItem("postsCategoryData", JSON.stringify(postsData));
    }
  }, [form]);

  // Provide the context value to children components.
  const value = {
    form,
    setForm,
    categoryTab,
    handleCategoryTabChange,
    configurationTab,
    handleConfigurationTabChange,
    handleFormChange,
    handleAppToggle,
    settings,
    handleSettingsChange,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
