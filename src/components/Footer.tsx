export default function Footer() {
  return (
    <footer id="contact" className="bg-peach-100">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center">
        <p className="text-xs text-forest-950/50">
          © {new Date().getFullYear()} Ceylon Unscripted. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
