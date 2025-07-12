'use client'
import {Mosaic} from "react-loading-indicators"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center animate-fade-in pt-16">
      
      <Mosaic color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} size="large" text="Loading..." textColor="black" />
    </div>
  );
};

// This component displays a loading indicator with a mosaic effect and a "Loading..." message.
// It uses the `react-loading-indicators` library to create a visually appealing loading animation.