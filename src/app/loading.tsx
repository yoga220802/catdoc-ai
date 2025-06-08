import LoadingScreen from "./components/features/LoadingScreen";

LoadingScreen
// File ini secara otomatis akan digunakan oleh Next.js sebagai fallback loading.
// Tidak perlu state, effect, atau router.
export default function Loading() {
  return <LoadingScreen />;
}
