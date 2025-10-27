import { ApiError } from "./api.error.js";
import ffprobe from "ffprobe";
import ffprobeStatic from "ffprobe-static";
export const fetchVideoDuration = async (file) => {
  try {
      const info = await ffprobe(file.path, { path: ffprobeStatic.path });
      const duration = Math.round(parseFloat(info?.streams?.[0].duration) / 60);
      return duration;
    
  } catch (err) {
    console.log(err)
    throw new ApiError(500, "Error parsing video duration");
  }
};
