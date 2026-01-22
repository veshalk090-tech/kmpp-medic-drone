import 'package:flutter/material.dart';

void main() {
  runApp(const SkyMatrixApp());
}

class SkyMatrixApp extends StatelessWidget {
  const SkyMatrixApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SkyMatrix - Medicine Delivery',
      theme: ThemeData(
        primaryColor: const Color(0xFF00b050),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class Medicine {
  final int id;
  final String name;
  final double price;
  final int stock;
  final String category;
  final String emoji;

  Medicine({
    required this.id,
    required this.name,
    required this.price,
    required this.stock,
    required this.category,
    required this.emoji,
  });
}

class CartItem {
  final Medicine medicine;
  int quantity;

  CartItem({required this.medicine, required this.quantity});

  double get total => medicine.price * quantity;
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final List<Medicine> medicines = [
    Medicine(id: 1, name: "Paracetamol 500mg", price: 2.50, stock: 50, category: "pain", emoji: "💊"),
    Medicine(id: 2, name: "Ibuprofen 200mg", price: 3.00, stock: 40, category: "pain", emoji: "💊"),
    Medicine(id: 3, name: "Cough Syrup", price: 4.50, stock: 30, category: "cold", emoji: "🧪"),
    Medicine(id: 4, name: "Vitamin C Tablets", price: 2.00, stock: 60, category: "vitamin", emoji: "🟡"),
    Medicine(id: 5, name: "Allergy Relief", price: 3.50, stock: 25, category: "cold", emoji: "💊"),
    Medicine(id: 6, name: "Aspirin 100mg", price: 1.50, stock: 75, category: "pain", emoji: "💊"),
    Medicine(id: 7, name: "Amoxicillin 500mg", price: 5.00, stock: 35, category: "antibiotic", emoji: "🔬"),
    Medicine(id: 8, name: "Metformin 500mg", price: 3.75, stock: 45, category: "diabetes", emoji: "💉"),
    Medicine(id: 9, name: "Lisinopril 10mg", price: 4.25, stock: 40, category: "blood-pressure", emoji: "❤️"),
    Medicine(id: 10, name: "Atorvastatin 20mg", price: 5.50, stock: 30, category: "cholesterol", emoji: "🥬"),
    Medicine(id: 11, name: "Diphenhydramine 25mg", price: 2.75, stock: 55, category: "cold", emoji: "😴"),
    Medicine(id: 12, name: "Omeprazole 20mg", price: 3.25, stock: 50, category: "stomach", emoji: "🤢"),
  ];

  List<CartItem> cart = [];
  String searchQuery = "";
  String selectedCategory = "all";

  @override
  Widget build(BuildContext context) {
    List<Medicine> filteredMedicines = medicines.where((med) {
      bool matchesSearch = med.name.toLowerCase().contains(searchQuery.toLowerCase());
      bool matchesCategory = selectedCategory == "all" || med.category == selectedCategory;
      return matchesSearch && matchesCategory;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 2,
        title: const Text("🚁 SkyMatrix", style: TextStyle(color: Color(0xFF00b050), fontWeight: FontWeight.bold)),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart, color: Color(0xFF00b050)),
                onPressed: _showCart,
              ),
              if (cart.isNotEmpty)
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                    child: Text(
                      cart.fold(0, (sum, item) => sum + item.quantity).toString(),
                      style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              onChanged: (value) => setState(() => searchQuery = value),
              decoration: InputDecoration(
                hintText: "Search medicines...",
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
          SizedBox(
            height: 50,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: ["all", "pain", "cold", "vitamin"].map((category) {
                return Padding(
                  padding: const EdgeInsets.only(right: 10),
                  child: FilterChip(
                    label: Text(category.toUpperCase()),
                    selected: selectedCategory == category,
                    onSelected: (selected) => setState(() => selectedCategory = category),
                    backgroundColor: Colors.white,
                    selectedColor: const Color(0xFF00b050),
                    labelStyle: TextStyle(color: selectedCategory == category ? Colors.white : Colors.black),
                  ),
                );
              }).toList(),
            ),
          ),
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: filteredMedicines.length,
              itemBuilder: (context, index) {
                final medicine = filteredMedicines[index];
                return ProductCard(medicine: medicine, onAddToCart: () => _addToCart(medicine));
              },
            ),
          ),
        ],
      ),
    );
  }

  void _addToCart(Medicine medicine) {
    setState(() {
      final existing = cart.firstWhere(
        (item) => item.medicine.id == medicine.id,
        orElse: () => CartItem(medicine: medicine, quantity: 0),
      );
      if (existing.quantity > 0) {
        existing.quantity++;
      } else {
        cart.add(CartItem(medicine: medicine, quantity: 1));
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("${medicine.name} added to cart!"), duration: const Duration(seconds: 1)),
    );
  }

  void _showCart() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => CartBottomSheet(
        cart: cart,
        onQuantityChange: (index, quantity) {
          setState(() {
            if (quantity <= 0) {
              cart.removeAt(index);
            } else {
              cart[index].quantity = quantity;
            }
          });
        },
        onRemove: (index) => setState(() => cart.removeAt(index)),
        onCheckout: _goToCheckout,
      ),
    );
  }

  void _goToCheckout() {
    Navigator.pop(context);
    Navigator.push(context, MaterialPageRoute(builder: (context) => CheckoutScreen(cart: cart)));
  }
}

class ProductCard extends StatelessWidget {
  final Medicine medicine;
  final VoidCallback onAddToCart;

  const ProductCard({Key? key, required this.medicine, required this.onAddToCart}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Column(
        children: [
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF667eea), Color(0xFF764ba2)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
              ),
              child: Center(child: Text(medicine.emoji, style: const TextStyle(fontSize: 40))),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(medicine.name, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("\$${medicine.price.toStringAsFixed(2)}", style: const TextStyle(color: Color(0xFF00b050), fontWeight: FontWeight.bold)),
                    Text("${medicine.stock} left", style: const TextStyle(fontSize: 11, color: Colors.grey)),
                  ],
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: onAddToCart,
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF00b050)),
                    child: const Text("Add", style: TextStyle(color: Colors.white, fontSize: 12)),
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class CartBottomSheet extends StatelessWidget {
  final List<CartItem> cart;
  final Function(int, int) onQuantityChange;
  final Function(int) onRemove;
  final VoidCallback onCheckout;

  const CartBottomSheet({
    Key? key,
    required this.cart,
    required this.onQuantityChange,
    required this.onRemove,
    required this.onCheckout,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double total = cart.fold(0, (sum, item) => sum + item.total);

    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      maxChildSize: 0.9,
      builder: (context, scrollController) {
        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Your Cart", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context)),
                ],
              ),
            ),
            if (cart.isEmpty)
              Expanded(child: Center(child: Text("Your cart is empty", style: TextStyle(color: Colors.grey[600]))))
            else
              Expanded(
                child: ListView.builder(
                  controller: scrollController,
                  itemCount: cart.length,
                  itemBuilder: (context, index) {
                    final item = cart[index];
                    return ListTile(
                      title: Text(item.medicine.name),
                      subtitle: Text("\$${item.medicine.price.toStringAsFixed(2)} x ${item.quantity}"),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(icon: const Icon(Icons.remove), onPressed: () => onQuantityChange(index, item.quantity - 1)),
                          Text("${item.quantity}"),
                          IconButton(icon: const Icon(Icons.add), onPressed: () => onQuantityChange(index, item.quantity + 1)),
                          IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: () => onRemove(index)),
                        ],
                      ),
                    );
                  },
                ),
              ),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(border: Border(top: BorderSide(color: Colors.grey[300]!))),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Total:", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      Text("\$${total.toStringAsFixed(2)}", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF00b050))),
                    ],
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: cart.isEmpty ? null : onCheckout,
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF00b050)),
                      child: const Text("Proceed to Checkout", style: TextStyle(color: Colors.white)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}

class CheckoutScreen extends StatefulWidget {
  final List<CartItem> cart;

  const CheckoutScreen({Key? key, required this.cart}) : super(key: key);

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _locationController = TextEditingController();
  final _notesController = TextEditingController();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    double total = widget.cart.fold(0, (sum, item) => sum + item.total);

    return Scaffold(
      appBar: AppBar(title: const Text("Checkout"), backgroundColor: const Color(0xFF00b050)),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _nameController,
              decoration: InputDecoration(labelText: "Full Name", border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
              validator: (value) => value?.isEmpty ?? true ? "Required" : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _emailController,
              decoration: InputDecoration(labelText: "Email", border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
              validator: (value) => value?.isEmpty ?? true ? "Required" : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _phoneController,
              decoration: InputDecoration(labelText: "Phone", border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
              validator: (value) => value?.isEmpty ?? true ? "Required" : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _locationController,
              decoration: InputDecoration(labelText: "Delivery Location", border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
              validator: (value) => value?.isEmpty ?? true ? "Required" : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _notesController,
              decoration: InputDecoration(labelText: "Special Instructions", border: OutlineInputBorder(borderRadius: BorderRadius.circular(8))),
              maxLines: 3,
            ),
            const SizedBox(height: 20),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Order Summary", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 8),
                    ...widget.cart.map((item) => Text("${item.medicine.name} x${item.quantity} = \$${item.total.toStringAsFixed(2)}")),
                    const Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("Total:", style: TextStyle(fontWeight: FontWeight.bold)),
                        Text("\$${total.toStringAsFixed(2)}", style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF00b050))),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              height: 50,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _submitOrder,
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF00b050)),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Confirm Order", style: TextStyle(color: Colors.white, fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _submitOrder() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    setState(() => _isLoading = false);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("✓ Order Confirmed!"),
        content: Text("Your drone will arrive in 15-30 minutes.\nOrder ID: ORD-${DateTime.now().millisecond}"),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            child: const Text("Done"),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _locationController.dispose();
    _notesController.dispose();
    super.dispose();
  }
}