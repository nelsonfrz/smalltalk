"use client";

import Wheel from "@/components/wheel/wheel";
import Confetti from "react-confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Stopwatch } from "@/components/stopwatch/stopwatch";
import { useWindowDimensions } from "@/lib/use-window-dimensions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import ItemsForm from "@/components/wheel/items-form";
import { conversationStarters } from "@/lib/conversation-starters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRandomItems } from "@/lib/utils";

const segColors = [
  "#EE4040",
  "#F0CF50",
  "#815CD1",
  "#3DA5E0",
  "#34A24F",
  "#F9AA1F",
  "#EC3F3F",
  "#FF9000",
];

export default function Home() {
  const { width, height } = useWindowDimensions();
  const [finished, setFinished] = useState(false);
  const [items, setItems] = useState<string[]>(
    getRandomItems(conversationStarters, 10),
  );
  const [editItemsOpen, setEditItemsOpen] = useState(false);

  return (
    <div className="mt-4 flex flex-col items-center justify-center gap-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Smalltalk!
      </h1>
      {finished && (
        <Confetti
          run={finished}
          recycle={false}
          numberOfPieces={700}
          tweenDuration={5000}
          onConfettiComplete={() => {
            setFinished(false);
          }}
          width={width ?? 0}
          height={height ?? 0}
        />
      )}

      <Wheel
        items={items}
        segColors={segColors}
        onFinished={(winner) => {
          setFinished(true);
        }}
        primaryColor="black"
        contrastColor="white"
        buttonText="Smalltalk!"
        isOnlyOnce={false}
        size={400}
        fontFamily="Arial"
      />

      <div>
        <Stopwatch />

        <Dialog open={editItemsOpen} onOpenChange={setEditItemsOpen}>
          <DialogTrigger asChild>
            <Button className="mt-2 flex w-44 justify-center gap-2">
              <Pencil className="h-4 w-4" /> Edit items
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-screen overflow-y-scroll lg:max-w-screen-sm">
            <DialogHeader>
              <DialogTitle>Edit items</DialogTitle>
            </DialogHeader>
            <ItemsForm
              items={items}
              onSubmit={(items) => {
                setItems(items);
                setEditItemsOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
