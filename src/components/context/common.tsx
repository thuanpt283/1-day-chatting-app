import { CHANNELS } from "@/enums/channel";
import type { ChannelId, UserId } from "@/types";
import { createContext, useContext, useState, type ReactNode, } from "react";

type InfoContextType = {
  channel: ChannelId;
  user: UserId | undefined;
  setChannel: (c: ChannelId) => void;
  setUser: (c: UserId) => void;
};

const InfoContext = createContext<InfoContextType | undefined>(undefined);

export function InfoProvider({ children }: { children: ReactNode }) {
  const [channel, setChannel] = useState<ChannelId>(CHANNELS.GENERAL);
  const [user, setUser] = useState<UserId>();

  return (
    <InfoContext.Provider value={{ channel, setChannel, user, setUser }}>
      {children}
    </InfoContext.Provider>
  );
}

export function useInfo() {
  const ctx = useContext(InfoContext);
  if (!ctx) {
    throw new Error("useInfo must be used within InfoProvider");
  }
  return ctx;
}
