import { MokuroBlock, PageContent } from "@/entities/manga";
import { useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { Image } from "expo-image";

interface PageRendererProps {
  pageContent: PageContent;
}

export default function PageRenderer({ pageContent }: PageRendererProps) {
  const screenWidth = Dimensions.get("window").width;
  const scale = screenWidth / pageContent.width;
  const height = pageContent.height * scale;

  return (
    <Zoomable isDoubleTapEnabled style={{ flex: 1 }}>
      <View style={{ flex: 1, width: screenWidth, justifyContent: "center" }}>
        <View
          style={{
            width: screenWidth,
            height,
          }}
        >
          <Image
            source={pageContent.uri}
            style={{ width: screenWidth, height }}
          />
          {pageContent.blocks.map((block, i) => (
            <OCRBox key={i} block={block} scale={scale} />
          ))}
        </View>
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

  const lineCount = Math.max(block.lines.length, 1);
  const longestLine = Math.max(
    1,
    ...block.lines.map((l) => Array.from(l).length),
  );

  const charSize = block.vertical
    ? Math.min(width / lineCount, height / (longestLine + 0.5))
    : Math.min(height / lineCount, width / (longestLine + 0.5));
  const fontSize = charSize * 0.9;

  return (
    <Pressable
      onPress={() => {
        setRevealed((v) => !v);
      }}
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        backgroundColor: revealed ? "rgba(255,255,255,0.92)" : "transparent",
        flexDirection: block.vertical ? "row-reverse" : "column",
        overflow: "visible",
      }}
    >
      {revealed &&
        block.lines.map((line, i) => (
          <Text
            key={i}
            style={{
              fontSize: fontSize * 0.85,
              color: "black",
              width: block.vertical ? charSize * 0.85 : undefined,
              includeFontPadding: false,
            }}
          >
            {block.vertical ? Array.from(line).join("\n") : line}
          </Text>
        ))}
    </Pressable>
  );
}
