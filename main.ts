/// <reference lib="deno.unstable" />
const kv = await Deno.openKv();

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

type Data = {
  peopleHere: Array<string>;
};

type DataWhenJoined = {
  you: string;
  peopleHere: Array<string>;
};

const initialData: Data = {
  peopleHere: [],
};

const result = await kv.set(["data"], initialData);

if (!result.ok) {
  console.error("Issue setting initial data");
}

const router = new Router();

router
  .get("/", async (ctx) => {
    const ip = ctx.request.ip;

    const nameFromIp = (await kv.get<string>([ip])).value;
    const ipExistsInDb = nameFromIp !== null;

    const data = await kv.get<Data>(["data"]);
    if (ipExistsInDb) {
      ctx.response.body = { ...data.value, you: nameFromIp };
    } else {
      ctx.response.body = data.value;
    }
  })
  .get("/enter/:name", async (ctx) => {
    const ip = ctx.request.ip;
    const nameToEnter = ctx.params.name;

    if (nameToEnter === "") {
      ctx.response.body = "Who are you?";
      return;
    }

    const nameFromIp = (await kv.get<string>([ip])).value;
    const ipExistsInDb = nameFromIp !== null;

    const data = await kv.get<Data>(["data"]);

    //cant join more than once if IP exists
    if (ipExistsInDb) {
      ctx.response.body = "You're already in the social room";
      return;
    } else {
      const ipAdded = await kv.set([ip], nameToEnter);

      const nameAppendedToRoom = await kv
        .set(["data"], {
          peopleHere: [...data.value?.peopleHere!, nameToEnter],
        });

      const newData = await kv.get(["data"]);

      if (!ipAdded.ok) {
        ctx.response.body =
          "Someone like you seems to have entered simultaneously!";
        return;
      }

      if (!nameAppendedToRoom.ok) {
        ctx.response.body = "Someone like you is already here!";
        return;
      }

      ctx.response.body = {
        ...newData.value as DataWhenJoined,
        you: nameToEnter,
      };
    }
  })
  .get("/leave/:name", async (ctx) => {
    const ip = ctx.request.ip;
    const nameToLeave = ctx.params.name;

    if (nameToLeave === "") {
      ctx.response.body = "Who are you?";
    }

    const nameFromIp = (await kv.get<string>([ip])).value;
    const ipExistsInDb = nameFromIp !== null;

    const data = await kv.get<Data>(["data"]);

    if (ipExistsInDb) {
      //leave
      await kv.delete([ip]);

      const personRemoved = await kv
        .set(["data"], {
          peopleHere: data.value?.peopleHere.filter((x) => x !== nameToLeave),
        });

      if (!personRemoved.ok) {
        ctx.response.body = "Could not escort you out of the room";
        return;
      }

      const newData = await kv.get(["data"]);
      ctx.response.body = newData.value as Data;
    } else {
      ctx.response.body = "You're not in the social room";
      return;
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
