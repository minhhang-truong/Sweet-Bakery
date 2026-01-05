import logoImg from '../../assets/images/common/logo-sweet-bakery.png';

const ManagerFooter = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8 px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-8">
        {/* Logo and Info */}
        <div className="flex items-start gap-4">
          <div className="bg-card rounded-xl p-3 w-16 h-16 flex items-center justify-center">
            <img src={logoImg} alt="Logo"/>
          </div>
          <div>
            <h3 className="font-script text-2xl mb-2">Sweet Bakery</h3>
            <p className="text-sm opacity-90">
              No 1 Dai Co Viet, Hai Ba Trung, Ha Noi, Vietnam
            </p>
            <p className="text-sm opacity-90">+84 12345678</p>
            <p className="text-sm opacity-90">sweetbakery@gmail.com</p>
            <p className="text-sm opacity-90">Opening hours: 7am - 11pm</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex gap-16">
          <div className="space-y-1">
            <a href="#" className="block text-sm hover:underline">Home</a>
            <a href="#" className="block text-sm hover:underline">Menu / Products</a>
            <a href="#" className="block text-sm hover:underline">About Us</a>
            <a href="#" className="block text-sm hover:underline">Contact / Order</a>
            <a href="#" className="block text-sm hover:underline">FAQ / Policy</a>
          </div>
          <div className="space-y-1">
            <a href="#" className="block text-sm hover:underline">Facebook</a>
            <a href="#" className="block text-sm hover:underline">Instagram</a>
            <a href="#" className="block text-sm hover:underline">Tiktok</a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-right">
          <div className="bg-card text-foreground px-3 py-1 rounded text-xs mb-2">
            ĐÃ THÔNG BÁO
          </div>
          <p className="text-sm">© 2025 Savor Cake. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default ManagerFooter;
