import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";

// [1, 78, 8, 9]
// [{id: 1, username: 'tim'}, {}, {}, {}]
export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | undefined>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);

      return keys.map((key) =>
        updoots.find(
          (updoot) =>
            updoot.postId === key.postId && updoot.userId === key.userId
        )
      );
    }
  );
