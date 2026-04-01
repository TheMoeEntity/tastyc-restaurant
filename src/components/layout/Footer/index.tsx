export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-center py-6 mt-10">
      <p>© {new Date().getFullYear()} Tastyc Restaurant</p>
      <p className="text-sm mt-2">
        Built with ❤️ using Next.js
      </p>
    </footer>
  );
}