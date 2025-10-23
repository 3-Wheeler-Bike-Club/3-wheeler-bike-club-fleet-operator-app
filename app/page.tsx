import { Wrapper } from "@/components/landing/wrapper";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full">
        <div
          className="
            absolute inset-0
            bg-[url('/images/dodo.svg')]
            bg-center bg-cover
            opacity-23      /* adjust to taste */
            -z-10
          "
        />
        <Wrapper/>
    </div>
  );
}