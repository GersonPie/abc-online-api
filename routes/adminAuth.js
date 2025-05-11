router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(email === "AbcOnline" && password === "21abc-ca3112@online") {
        const token = jwt.sign({ id: "admin" }, process.env.JWT_SECRET, { expiresIn: '10min' });
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone } });
    console.log("User logged in:", user);
  
      return res.status(200).json({ message: "Login successful" });
    }
    else{
        return res.status(401).json({ message: "Invalid credentials" });
    }
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
    
});

export default router;