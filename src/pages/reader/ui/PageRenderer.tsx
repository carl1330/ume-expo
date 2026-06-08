import { MokuroBlock, PageContent } from "@/entities/manga";
import { useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { Image } from "expo-image";

const DEBUG = true;

interface PageRendererProps {
  pageContent: PageContent;
}

export default function PageRenderer({ pageContent }: PageRendererProps) {
  const screenWidth = Dimensions.get("window").width;
  const scale = screenWidth / pageContent.width;
  const height = pageContent.height * scale;

  if (DEBUG) {
    console.log("[PageRenderer]", {
      uri: pageContent.uri,
      width: pageContent.width,
      height: pageContent.height,
      blocks: pageContent.blocks.length,
    });
  }

  return (
    <Zoomable isDoubleTapEnabled>
      <View
        style={{
          width: screenWidth,
          height,
          backgroundColor: DEBUG ? "#fdd" : undefined,
        }}
      >
        <Image
          source={pageContent.uri}
          style={{ width: screenWidth, height }}
          onError={
            DEBUG
              ? (e) => console.log("[Image error]", pageContent.uri, e)
              : undefined
          }
          onLoad={
            DEBUG ? () => console.log("[Image ok]", pageContent.uri) : undefined
          }
        />
        {pageContent.blocks.map((block, i) => (
          <OCRBox key={i} block={block} scale={scale} />
        ))}
      </View>
    </Zoomable>
  );
}

function OCRBox({ block, scale }: { block: MokuroBlock; scale: number }) {
  const [revealed, setRevealed] = useState(false);
  const [x1, y1, x2, y2] = block.box;
  const left = x1 * scale;
  const top = y1 * scale;
  const width = (x2 - x1) * scale;
  const height = (y2 - y1) * scale;
  const fontSize = block.font_size * scale;

  const text = block.vertical
    ? block.lines.map((l) => l.split("").join("\n")).join("\n")
    : block.lines.join("\n");

  return (
    <Pressable
      onPress={() => setRevealed((v) => !v)}
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        backgroundColor: revealed
          ? "rgba(255,255,255,0.92)"
          : DEBUG
            ? "rgba(255,0,0,0.2)"
            : "transparent",
        borderWidth: DEBUG ? 1 : 0,
        borderColor: "red",
      }}
    >
      {revealed && (
        <Text
          style={{
            fontSize,
            lineHeight: fontSize * 1.1,
            color: "black",
            textAlign: block.vertical ? "center" : "left",
          }}
        >
          {text}
        </Text>
      )}
    </Pressable>
  );
}
