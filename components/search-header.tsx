"use client";

import { Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchHeaderProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onSearch: (event: FormEvent) => void;
  isActive: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

interface SearchInputProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  disabled?: boolean;
}

function SearchInput({
  query,
  isLoading,
  onQueryChange,
  disabled = false,
}: SearchInputProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search for art..."
        className="!bg-background/70 tracking-tighter backdrop-blur-sm"
        disabled={disabled || isLoading}
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        disabled={disabled || isLoading}
        aria-label="Search"
        title="Search"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <Send className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function SearchHeader({
  query,
  isLoading,
  onQueryChange,
  onSearch,
  isActive,
  onSuggestionClick,
}: SearchHeaderProps) {
  const suggestions = [
    "Still life paintings",
    "Paintings of flowers",
    "Woodcuts of landscapes",
    "Portraits of women",
    "Sculptures of animals",
    "Paintings of the sea",
    "Ancient coins",
  ];

  return (
    <>
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4 sm:max-w-md sm:px-5 lg:max-w-2xl lg:px-6"
        style={{ pointerEvents: isActive ? "none" : "auto" }}
      >
        {/* Title - fades out first (no delay) */}
        <motion.h1
          className="font-light tracking-tighter text-4xl md:text-5xl mb-4 text-center"
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{
            duration: 0.3,
            delay: 0,
            ease: "easeInOut",
          }}
        >
          Discover art with <br /> natural language
        </motion.h1>

        {/* Input - fades out second (0.2s delay) */}
        <motion.form
          onSubmit={onSearch}
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{
            duration: 0.3,
            delay: isActive ? 0.2 : 0,
            ease: "easeInOut",
          }}
        >
          <SearchInput
            query={query}
            isLoading={isLoading}
            onQueryChange={onQueryChange}
          />
        </motion.form>

        {/* Suggestions - fade out last (0.4s delay) */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-4"
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{
            duration: 0.3,
            delay: isActive ? 0.4 : 0,
            ease: "easeInOut",
          }}
        >
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
              className="font-light bg-background/70 text-xs sm:text-sm backdrop-blur-sm"
            >
              {suggestion}
            </Button>
          ))}
        </motion.div>
        <motion.div
          animate={{ opacity: isActive ? 0 : 1 }}
          transition={{
            duration: 0.3,
            delay: isActive ? 0.4 : 0,
            ease: "easeInOut",
          }}
          className="mt-4 text-center text-xs text-muted-foreground"
        >
          <p>
            Search through over 50,000 images from the National Gallery of Art
            public collection.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 sm:max-w-md sm:px-5 lg:max-w-2xl lg:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{
          duration: 0.3,
          delay: isActive ? 0.7 : 0,
          ease: "easeInOut",
        }}
        style={{ pointerEvents: isActive ? "auto" : "none" }}
      >
        <form onSubmit={onSearch}>
          <SearchInput
            query={query}
            isLoading={isLoading}
            onQueryChange={onQueryChange}
          />
        </form>
      </motion.div>
    </>
  );
}
