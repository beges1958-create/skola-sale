export type MarkdownPreset = "phone" | "desktop";

export const markdownStilovi: Record<MarkdownPreset, Record<string, any>> = {
  phone: {
    body: { color: "#fff", fontSize: 16, lineHeight: 24 },
    paragraph: { marginTop: 0, marginBottom: 22 },
    heading1: { fontSize: 26, lineHeight: 32, fontWeight: "700", marginTop: 18, marginBottom: 10 },
    heading2: { color: "#fff", fontSize: 22, lineHeight: 28, fontWeight: "700", marginTop: 16, marginBottom: 8 },
    heading3: { color: "#fff", fontSize: 19, lineHeight: 26, fontWeight: "700", marginTop: 14, marginBottom: 8 },
    strong: { fontWeight: "700" },

    bullet_list: { marginTop: 6, marginBottom: 12, paddingLeft: 18 },
    ordered_list: { marginTop: 6, marginBottom: 12, paddingLeft: 18 },
    list_item: { marginBottom: 6 },
    hr: { marginTop: 14, marginBottom: 14, height: 1, backgroundColor: "#fff" },
    link: { textDecorationLine: "underline", fontWeight: "600" },
    blockquote: { paddingLeft: 12, borderLeftWidth: 3, marginTop: 10, marginBottom: 10 },
    code_inline: { fontFamily: "monospace", fontSize: 15 },
    code_block: { fontFamily: "monospace", fontSize: 14, padding: 12, borderRadius: 8, marginTop: 10, marginBottom: 10 },
  },

  desktop: {
    body: { color: "#fff", fontSize: 18, lineHeight: 28 },
    paragraph: { marginTop: 0, marginBottom: 14 },
    heading1: { color: "#fff", fontSize: 32, lineHeight: 40, fontWeight: "700", marginTop: 22, marginBottom: 12 },
    heading2: { color: "#fff", fontSize: 26, lineHeight: 34, fontWeight: "700", marginTop: 20, marginBottom: 10 },
    heading3: { color: "#fff", fontSize: 22, lineHeight: 30, fontWeight: "700", marginTop: 18, marginBottom: 10 },
    strong: { fontWeight: "700" },
    em: { fontStyle: "italic" },
    hr: {
     marginTop: 18,
     marginBottom: 18,
     height: 1,
     backgroundColor: "#fff",
    },


    bullet_list: { marginTop: 8, marginBottom: 14, paddingLeft: 22 },
    ordered_list: { marginTop: 8, marginBottom: 14, paddingLeft: 22 },
    list_item: { marginBottom: 8 },
    link: { textDecorationLine: "underline", fontWeight: "600" },
    blockquote: { paddingLeft: 14, borderLeftWidth: 4, marginTop: 12, marginBottom: 12 },
    code_inline: { fontFamily: "monospace", fontSize: 16 },
    code_block: { fontFamily: "monospace", fontSize: 15, padding: 14, borderRadius: 10, marginTop: 12, marginBottom: 12 },
  },
};
export default function _IgnoreAsRoute() {
  return null;
}
