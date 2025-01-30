import Container from "@/components/container";
import ThemeSwitch from "@/components/themeSwitch";
import Image from "next/image";
import { myLoader } from "@/utils/all";
import Link from "next/link";

export default function Footer(props) {
  return (
    <Container className="mt-10 border-t border-gray-100 dark:border-gray-800">
      <div className="text-center text-sm">
        <div className="mt-5 text-gray-600 dark:text-gray-400">
          Copyright © {new Date().getFullYear()} · Todos os direitos reservados.
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="mt-5">
          <ThemeSwitch />
        </div>
      </div>
    </Container>
  );
}
