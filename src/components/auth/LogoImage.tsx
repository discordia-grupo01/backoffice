import Image from "next/image";

/** Logo para la columna del formulario (mobile): una variante por tema. */
export function LogoImage() {
  return (
    <div className="auth-mobile-logo">
      <Image
        src="/logo-light.png"
        alt="discordia"
        width={1010}
        height={269}
        priority
        className="logo-on-dark"
        style={{ width: "100%", height: "auto" }}
      />
      <Image
        src="/logo.png"
        alt="discordia"
        width={1010}
        height={269}
        priority
        className="logo-on-light"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
