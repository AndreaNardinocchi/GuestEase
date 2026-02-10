import { supabase } from "../supabase/supabaseClient";

/**
 * This utility uploads an array of File objects to Supabase Storage.
 * Each file is placed under: rooms/<roomId>/<timestamp>-<sanitizedName>
 * https://supabase.com/docs/guides/storage
 * https://developer.mozilla.org/en-US/docs/Web/API/File/name
 */
export const uploadRoomImages = async (roomId: string, files: File[]) => {
  // This creates a List variable to which we will be pushing the uploaded images
  const uploadedPaths: string[] = [];

  // Sequential Reading Function
  // https://kanhaji.medium.com/read-files-in-javascript-like-a-hero-you-are-with-async-await-16841814ea41
  for (const file of files) {
    // Replace unsafe characters in filenames to avoid storage path issues.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
    const safeImageName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    /**
     * Prefix with folder + timestamp to avoid collisions.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
     * */
    const filePath = `rooms/${roomId}/${Date.now()}-${safeImageName}`;

    // Upload to Supabase Storage bucket named 'assets'.
    // https://supabase.com/docs/reference/javascript/storage-from-upload
    const { data, error } = await supabase.storage
      .from("assets")
      .upload(filePath, file);

    if (!error && data) {
      // We then 'push' the filePath to the uploadedPaths list
      uploadedPaths.push(filePath);
    }
  }

  return uploadedPaths;
};
