"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import Sidebar from "../../Common/modules/Sidebar";
import Indexer from "./Indexer";
import { Indexar } from "../../Common/types/common.types";
import ImageLarge from "./ImageLarge";
import QuoteBox from "./QuoteBox";
import Success from "./Success";
import ModalOpen from "./ModalOpen";
import Gifs from "./Gifs";
import CollectConfig from "./CollectConfig";
import MissingValues from "./MissingValues";
import QuestGates from "./QuestGates";
import Followers from "./Followers";
import CrearCuenta from "./CrearCuenta";
import Signless from "./Signless";

export default function ModalsEntry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  return (
    <>
      <Sidebar dict={dict} />
      {context?.indexar !== Indexar.Inactive && <Indexer dict={dict} />}
      {context?.quote?.open && <QuoteBox dict={dict} />}
      {context?.imageViewer && <ImageLarge />}
      {context?.missingValues && <MissingValues dict={dict} />}
      {context?.questGates && <QuestGates dict={dict} />}
      {context?.gif?.open && <Gifs dict={dict} />}
      {context?.collectOptions?.open && <CollectConfig dict={dict} />}
      {context?.followBox && <Followers />}
      {context?.crearCuenta && <CrearCuenta dict={dict} />}
      {context?.signless && <Signless dict={dict} />}
      {context?.modalOpen && <ModalOpen />}
      {context?.success && <Success />}
    </>
  );
}
