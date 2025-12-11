import { IconButton, Menu, Text } from "@chakra-ui/react";
import { useTranslation } from "@refinedev/core";
import { LuLanguages } from "react-icons/lu";
import { useState, useEffect } from "react";
import i18n from "../../i18n";

export const LanguageToggle = () => {
  const { changeLocale, getLocale } = useTranslation();
  const [currentLocale, setCurrentLocale] = useState(getLocale());

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
  ];

  // Subscribe to language changes
  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLocale(i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  const handleLanguageChange = async (langCode: string) => {
    try {
      if (langCode === currentLocale) return;
      await changeLocale(langCode);
      setCurrentLocale(langCode);
      // Force a full page re-render by reloading
      window.location.reload();
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton aria-label="Change language" variant="ghost" size="md">
          <LuLanguages />
        </IconButton>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          {languages.map((lang) => (
            <Menu.Item
              key={lang.code}
              value={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              bg={currentLocale === lang.code ? "gray.100" : "transparent"}
              fontWeight={currentLocale === lang.code ? "bold" : "normal"}
              _hover={{ bg: "blue.100" }}
            >
              <Text as="span" mr={2}>
                {lang.flag}
              </Text>
              {lang.label}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
};
