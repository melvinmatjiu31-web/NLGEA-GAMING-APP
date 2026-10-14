
import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, ScrollView, Image, ImageBackground,
  TouchableOpacity, TextInput, StatusBar, StyleSheet, Alert
} from "react-native";

const C = {
  teal: "#27C9C2", tealDark: "#159E9A", orange: "#FF8A00",
  coral: "#E85A68", purple: "#D84FEA", pale: "#F5FAF9",
  ink: "#20252A", muted: "#687477", white: "#FFFFFF", border: "#E4E8E8"
};

const packages = [
  { id:"escape", title:"Escape Room Challenge", category:"Challenge", price:750, color:C.coral,
    image:require("./assets/escape-room.jpg"), description:"Escape the room by solving puzzles before the time runs out.",
    includes:["Team challenge","Themed escape room","Digital scoreboard"] },
  { id:"vr", title:"Virtual Reality Experience", category:"Experience", price:750, color:C.orange,
    image:require("./assets/virtual-reality.jpg"), description:"VR games of all types are available for you to experience.",
    includes:["VR headsets","Choice of game","Staff assistance"] },
  { id:"racing", title:"Racing Simulator Challenge", category:"Challenge", price:750, color:C.orange,
    image:require("./assets/racing-simulator.jpg"), description:"Race against your friends and test your driving skills.",
    includes:["Racing simulator","Choice of tracks","Leaderboard competition"] },
  { id:"gamer", title:"Ultimate Gamer Pass", category:"Gaming", price:1150, color:C.coral,
    image:require("./assets/ultimate-gamer.jpg"), description:"Unlimited gaming access for the whole day.",
    includes:["PC gaming","Console gaming","High-speed internet","Snack voucher","Tournament entry"] },
  { id:"esports", title:"Esports Training Package", category:"Training", price:1500, color:C.purple,
    image:require("./assets/esports-training.jpg"), description:"Enhance your gaming skills with our professional coaching.",
    includes:["Strategy coaching","Team communication","Match analysis","Practice sessions","Performance feedback"] },
  { id:"birthday", title:"Birthday Party Package", category:"Party", price:1500, color:C.purple,
    image:require("./assets/birthday-party.jpg"), description:"Themed celebration for your special day.",
    includes:["Reserved gaming area","Multiplayer competitions","Party decorations","Catering","Tournament prizes"] },
];

const money = n => "R" + n.toLocaleString("en-ZA");

function PrimaryButton({title, onPress, color=C.orange, outline=false}) {
  return <TouchableOpacity onPress={onPress} activeOpacity={0.85}
    style={[styles.primaryButton,{backgroundColor:outline ? C.white : color,borderColor:color,borderWidth:outline?1:0}]}>
    <Text style={[styles.primaryButtonText,{color:outline?color:C.white}]}>{title}</Text>
  </TouchableOpacity>;
}

function Header({onMenu,onProfile}) {
  return <View style={styles.header}>
    <TouchableOpacity onPress={onMenu} style={styles.headerIcon}><Text style={styles.headerIconText}>☰</Text></TouchableOpacity>
    <Text style={styles.brand}>N L G E A</Text>
    <TouchableOpacity onPress={onProfile} style={styles.profile}><Text style={{fontSize:14}}>♙</Text></TouchableOpacity>
  </View>;
}

function BottomNav({active,onChange}) {
  const items=[["⌂","Home"],["ⓘ","About"],["▦","Packages"],["▣","Booking"],["✉","Contact"]];
  return <View style={styles.bottomNav}>{items.map(([icon,label])=>
    <TouchableOpacity key={label} onPress={()=>onChange(label)} style={styles.navItem}>
      <Text style={[styles.navIcon,{color:active===label?C.orange:C.tealDark}]}>{icon}</Text>
      <Text style={[styles.navLabel,{color:active===label?C.orange:C.muted}]}>{label}</Text>
    </TouchableOpacity>)}</View>;
}

function PackageCard({item,onPress,compact=false}) {
  return <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.packageCard}>
    <ImageBackground source={item.image} style={styles.packageImage} imageStyle={{borderTopLeftRadius:12,borderTopRightRadius:12}}>
      <View style={[styles.imageTint,{backgroundColor:item.color,opacity:0.42}]} />
      <View style={styles.imageCaption}><Text style={styles.packageTitle}>{item.title}</Text></View>
    </ImageBackground>
    <View style={styles.packageBody}>
      <Text style={styles.packageDescription} numberOfLines={compact?2:3}>{item.description}</Text>
      {!compact && <><Text style={styles.includesTitle}>Includes</Text>
        {item.includes.map(x=><Text key={x} style={styles.includeLine}>•  {x}</Text>)}</>}
      <View style={styles.priceRow}><Text style={styles.price}>{money(item.price)}</Text></View>
      <PrimaryButton title="Book  →" color={item.color} onPress={onPress}/>
    </View>
  </TouchableOpacity>;
}

export default function App() {
  const [tab,setTab]=useState("Home");
  const [selected,setSelected]=useState(null);
  const [search,setSearch]=useState("");
  const [booking,setBooking]=useState({name:"",email:"",date:"",time:"",guests:"2",notes:""});
  const [quantity,setQuantity]=useState(1);
  const [confirmed,setConfirmed]=useState(false);
  const [menuOpen,setMenuOpen]=useState(false);
  const filtered=useMemo(()=>packages.filter(p=>p.title.toLowerCase().includes(search.toLowerCase())),[search]);

  const openPackage = item => { setSelected(item); setQuantity(1); setConfirmed(false); setTab("Package"); };
  const changeTab = next => { setSelected(null); setMenuOpen(false); setTab(next); };

  const submitBooking = () => {
    if(!selected){Alert.alert("Choose a package","Please select a package before booking.");return;}
    if(!booking.name.trim() || !booking.email.trim() || !booking.date.trim()){
      Alert.alert("A few details are missing","Please enter your name, email and preferred date.");return;
    }
    setConfirmed(true);
  };

  const screenTitle = tab==="Package" ? "Package details" : tab;
  return <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="dark-content" backgroundColor={C.teal}/>
    <Header onMenu={()=>setMenuOpen(!menuOpen)} onProfile={()=>changeTab("Booking")}/>
    {menuOpen && <View style={styles.menu}>
      {["Home","About","Packages","Booking","Contact"].map(x=><TouchableOpacity key={x} onPress={()=>changeTab(x)} style={styles.menuItem}><Text style={styles.menuText}>{x}</Text></TouchableOpacity>)}
    </View>}
    {tab==="Home" && <ScrollView contentContainerStyle={styles.scrollContent}>
      <ImageBackground source={packages[0].image} style={styles.hero} imageStyle={{borderRadius:16}}>
        <View style={styles.heroOverlay}/>
        <Text style={styles.heroKicker}>PLAY • COMPETE • CONNECT</Text>
        <Text style={styles.heroTitle}>Your next level{'\n'}of fun starts here.</Text>
        <Text style={styles.heroCopy}>Gaming experiences for friends, families and teams.</Text>
        <PrimaryButton title="Explore Packages  →" onPress={()=>changeTab("Packages")} color={C.orange}/>
        <View style={{height:10}}/>
        <PrimaryButton title="Book a package" onPress={()=>changeTab("Packages")} color={C.coral}/>
      </ImageBackground>
      <View style={styles.aboutBox}><Text style={styles.sectionTitle}>About us</Text>
        <Text style={styles.bodyText}>Looking for an exciting experience? NLG EA brings gaming, challenges and unforgettable moments together. Find your next adventure with us.</Text>
        <TouchableOpacity onPress={()=>changeTab("About")}><Text style={styles.textLink}>Learn more  →</Text></TouchableOpacity>
      </View>
      <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>Popular packages</Text><TouchableOpacity onPress={()=>changeTab("Packages")}><Text style={styles.textLink}>View all</Text></TouchableOpacity></View>
      {packages.slice(0,3).map(p=><PackageCard key={p.id} item={p} compact onPress={()=>openPackage(p)}/>)}
    </ScrollView>}

    {tab==="About" && <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>About NLG EA</Text>
      <Text style={styles.pageSubtitle}>Gaming. Teamwork. Great memories.</Text>
      <View style={styles.infoGrid}>
        <View style={[styles.infoTile,{backgroundColor:C.teal}]}><Text style={styles.tileIcon}>✦</Text><Text style={styles.tileTitle}>Our vision</Text><Text style={styles.tileText}>To be a top spot for fun and interactive gaming experiences.</Text></View>
        <View style={[styles.infoTile,{backgroundColor:C.tealDark}]}><Text style={styles.tileIcon}>◎</Text><Text style={styles.tileTitle}>Our mission</Text><Text style={styles.tileText}>To deliver modern, exciting and inclusive experiences for every player.</Text></View>
        <View style={[styles.infoTile,{backgroundColor:C.orange}]}><Text style={styles.tileIcon}>🏆</Text><Text style={styles.tileTitle}>Our goals</Text><Text style={styles.tileText}>Create memorable activities, build skills and bring people together.</Text></View>
        <View style={[styles.infoTile,{backgroundColor:C.coral}]}><Text style={styles.tileIcon}>◷</Text><Text style={styles.tileTitle}>Our history</Text><Text style={styles.tileText}>A gaming community built around play, friendly competition and connection.</Text></View>
      </View>
      <View style={styles.aboutBox}><Text style={styles.sectionTitle}>About NLG EA</Text><Text style={styles.bodyText}>Whether you are planning a birthday, improving your esports skills or simply looking for a new challenge, our packages help you make every visit count.</Text></View>
      <PrimaryButton title="Explore our packages  →" onPress={()=>changeTab("Packages")}/>
    </ScrollView>}

    {tab==="Packages" && <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Our packages</Text><Text style={styles.pageSubtitle}>Choose your next gaming experience.</Text>
      <TextInput value={search} onChangeText={setSearch} placeholder="Search packages..." placeholderTextColor="#879394" style={styles.searchInput}/>
      {filtered.map(p=><PackageCard key={p.id} item={p} onPress={()=>openPackage(p)}/>)}
      {filtered.length===0 && <Text style={styles.bodyText}>No packages found. Try another search.</Text>}
    </ScrollView>}

    {tab==="Package" && selected && <ScrollView contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity onPress={()=>changeTab("Packages")}><Text style={styles.textLink}>← All packages</Text></TouchableOpacity>
      <Image source={selected.image} style={styles.detailImage}/>
      <View style={[styles.detailLabel,{backgroundColor:selected.color}]}><Text style={styles.detailTitle}>{selected.title}</Text></View>
      <Text style={styles.bodyText}>{selected.description}</Text>
      <View style={styles.whiteCard}><Text style={styles.includesTitle}>Includes</Text>{selected.includes.map(x=><Text key={x} style={styles.includeLine}>✓  {x}</Text>)}</View>
      <View style={styles.totalRow}><Text style={styles.sectionTitle}>Price per package</Text><Text style={styles.price}>{money(selected.price)}</Text></View>
      <View style={styles.quantityRow}><Text style={styles.bodyText}>Quantity</Text><View style={styles.quantityControls}>
        <TouchableOpacity onPress={()=>setQuantity(Math.max(1,quantity-1))} style={styles.qtyButton}><Text style={styles.qtyText}>−</Text></TouchableOpacity>
        <Text style={styles.qtyNumber}>{quantity}</Text>
        <TouchableOpacity onPress={()=>setQuantity(Math.min(20,quantity+1))} style={styles.qtyButton}><Text style={styles.qtyText}>＋</Text></TouchableOpacity>
      </View></View>
      <View style={styles.totalRow}><Text style={styles.sectionTitle}>Total</Text><Text style={styles.price}>{money(selected.price*quantity)}</Text></View>
      <PrimaryButton title="Continue to booking  →" onPress={()=>changeTab("Booking")} color={selected.color}/>
    </ScrollView>}

    {tab==="Booking" && <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Make your booking</Text><Text style={styles.pageSubtitle}>Tell us a little about your visit.</Text>
      {selected ? <View style={styles.selectedSummary}><Text style={styles.summaryTitle}>{selected.title}</Text><Text style={styles.bodyText}>{quantity} × {money(selected.price)} = {money(selected.price*quantity)}</Text></View> :
        <View style={styles.selectedSummary}><Text style={styles.summaryTitle}>Select a package</Text><Text style={styles.bodyText}>Choose one of our experiences first.</Text><PrimaryButton title="Browse packages" onPress={()=>changeTab("Packages")} color={C.teal}/></View>}
      {confirmed ? <View style={styles.successBox}><Text style={styles.successTitle}>Booking request received!</Text><Text style={styles.bodyText}>Thank you, {booking.name}. Your request for {selected.title} has been recorded on this screen. Our team would contact you to confirm availability.</Text><PrimaryButton title="Back to home" onPress={()=>{setBooking({name:"",email:"",date:"",time:"",guests:"2",notes:""});setSelected(null);changeTab("Home");}} color={C.teal}/></View> :
      <View style={styles.form}>
        <Text style={styles.label}>Full name *</Text><TextInput style={styles.input} value={booking.name} onChangeText={v=>setBooking({...booking,name:v})} placeholder="Enter your name"/>
        <Text style={styles.label}>Email address *</Text><TextInput style={styles.input} value={booking.email} onChangeText={v=>setBooking({...booking,email:v})} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none"/>
        <Text style={styles.label}>Preferred date *</Text><TextInput style={styles.input} value={booking.date} onChangeText={v=>setBooking({...booking,date:v})} placeholder="e.g. 25/11/2026"/>
        <Text style={styles.label}>Preferred time</Text><TextInput style={styles.input} value={booking.time} onChangeText={v=>setBooking({...booking,time:v})} placeholder="e.g. 14:00"/>
        <Text style={styles.label}>Number of guests</Text><TextInput style={styles.input} value={booking.guests} onChangeText={v=>setBooking({...booking,guests:v})} keyboardType="number-pad" placeholder="2"/>
        <Text style={styles.label}>Additional requests</Text><TextInput style={[styles.input,{height:92,textAlignVertical:"top"}]} value={booking.notes} onChangeText={v=>setBooking({...booking,notes:v})} multiline placeholder="Anything we should know?"/>
        <PrimaryButton title="Send booking request  →" onPress={submitBooking} color={C.orange}/>
        <Text style={styles.smallNote}>* Required fields. This demo stores the request only in the app; connect a booking service or backend for real submissions.</Text>
      </View>}
    </ScrollView>}

    {tab==="Contact" && <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Get in touch</Text><Text style={styles.pageSubtitle}>We would love to hear from you.</Text>
      <View style={styles.contactCard}><Text style={styles.contactIcon}>☎</Text><View style={{flex:1}}><Text style={styles.contactTitle}>Phone</Text><Text style={styles.bodyText}>+27 12 345 6789</Text></View></View>
      <View style={styles.contactCard}><Text style={styles.contactIcon}>✉</Text><View style={{flex:1}}><Text style={styles.contactTitle}>Email</Text><Text style={styles.bodyText}>hello@nlgea.example</Text></View></View>
      <View style={styles.contactCard}><Text style={styles.contactIcon}>◷</Text><View style={{flex:1}}><Text style={styles.contactTitle}>Opening hours</Text><Text style={styles.bodyText}>Monday–Sunday: 09:00–20:00</Text></View></View>
      <View style={styles.whiteCard}><Text style={styles.sectionTitle}>Send us a message</Text>
        <TextInput style={styles.input} placeholder="Your name"/>
        <TextInput style={styles.input} placeholder="Your email"/>
        <TextInput style={[styles.input,{height:100,textAlignVertical:"top"}]} multiline placeholder="Your message"/>
        <PrimaryButton title="Send message  →" onPress={()=>Alert.alert("Thank you","Your message form is a demo. Connect it to a backend to send messages.")} color={C.orange}/>
      </View>
    </ScrollView>}

    <BottomNav active={tab==="Package"?"Packages":tab} onChange={changeTab}/>
  </SafeAreaView>;
}

const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:C.pale},header:{height:48,backgroundColor:C.teal,flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:13},
 headerIcon:{width:34},headerIconText:{fontSize:19,color:C.white},brand:{fontSize:14,letterSpacing:4,color:"#F7D95C",fontWeight:"900"},profile:{height:25,width:25,backgroundColor:C.white,borderRadius:4,alignItems:"center",justifyContent:"center"},
 menu:{position:"absolute",top:48,left:8,zIndex:10,backgroundColor:C.white,padding:8,borderRadius:10,elevation:8,minWidth:150},menuItem:{paddingVertical:10,paddingHorizontal:12},menuText:{color:C.ink,fontWeight:"600"},
 scrollContent:{padding:14,paddingBottom:26},hero:{minHeight:310,justifyContent:"flex-end",padding:18,overflow:"hidden",marginBottom:15},heroOverlay:{...StyleSheet.absoluteFillObject,backgroundColor:"rgba(15,25,32,0.55)",borderRadius:16},heroKicker:{color:C.teal,fontWeight:"900",letterSpacing:1.2,fontSize:13,marginBottom:8},heroTitle:{fontSize:29,fontWeight:"900",color:C.white,lineHeight:34},heroCopy:{color:C.white,fontSize:14,lineHeight:20,marginTop:8,marginBottom:15},
 primaryButton:{minHeight:42,borderRadius:22,alignItems:"center",justifyContent:"center",paddingHorizontal:16,marginTop:8},primaryButtonText:{fontWeight:"800",fontSize:13},
 aboutBox:{backgroundColor:C.white,borderColor:C.border,borderWidth:1,borderRadius:13,padding:15,marginBottom:17},sectionHeading:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginVertical:6},sectionTitle:{fontSize:17,fontWeight:"900",color:C.ink},bodyText:{fontSize:13,color:C.muted,lineHeight:20,marginTop:6},textLink:{fontSize:13,color:C.tealDark,fontWeight:"800",marginTop:9},
 pageTitle:{fontSize:25,fontWeight:"900",color:C.ink,marginTop:4},pageSubtitle:{fontSize:14,color:C.muted,marginTop:5,marginBottom:15},infoGrid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",marginBottom:16},infoTile:{width:"48.5%",minHeight:150,borderRadius:12,padding:14,marginBottom:10},tileIcon:{fontSize:24,color:C.white},tileTitle:{fontSize:16,fontWeight:"900",color:C.white,marginTop:8},tileText:{fontSize:12,color:C.white,lineHeight:17,marginTop:6},
 packageCard:{backgroundColor:C.white,borderRadius:12,borderWidth:1,borderColor:C.border,marginBottom:15,overflow:"hidden",elevation:1},packageImage:{height:145,justifyContent:"flex-end"},imageTint:{...StyleSheet.absoluteFillObject},imageCaption:{padding:13,backgroundColor:"rgba(0,0,0,0.2)"},packageTitle:{fontSize:18,fontWeight:"900",color:C.white,textShadowColor:"#222",textShadowRadius:4},packageBody:{padding:13},packageDescription:{fontSize:13,color:C.muted,lineHeight:19,marginBottom:9},includesTitle:{fontSize:14,fontWeight:"900",color:C.ink,marginTop:4,marginBottom:5},includeLine:{fontSize:13,color:C.ink,lineHeight:22},priceRow:{alignItems:"flex-end",marginTop:5},price:{fontSize:17,fontWeight:"900",color:C.ink},searchInput:{height:44,borderWidth:1,borderColor:C.border,borderRadius:10,backgroundColor:C.white,paddingHorizontal:13,marginBottom:14,color:C.ink},
 detailImage:{width:"100%",height:190,borderRadius:14,marginTop:12},detailLabel:{padding:14,borderBottomLeftRadius:12,borderBottomRightRadius:12,marginBottom:12},detailTitle:{fontSize:19,color:C.white,fontWeight:"900"},whiteCard:{backgroundColor:C.white,borderRadius:12,borderWidth:1,borderColor:C.border,padding:14,marginVertical:10},totalRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginVertical:9},quantityRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginVertical:10},quantityControls:{flexDirection:"row",alignItems:"center",backgroundColor:C.white,borderRadius:25,borderWidth:1,borderColor:C.border},qtyButton:{width:39,height:37,alignItems:"center",justifyContent:"center"},qtyText:{fontSize:21,color:C.tealDark,fontWeight:"800"},qtyNumber:{minWidth:32,textAlign:"center",fontWeight:"800",color:C.ink},
 selectedSummary:{backgroundColor:"#DDF8F5",borderRadius:12,padding:14,marginBottom:13},summaryTitle:{fontWeight:"900",fontSize:15,color:C.ink},form:{backgroundColor:C.white,borderRadius:12,padding:14,borderColor:C.border,borderWidth:1},label:{fontSize:13,fontWeight:"800",color:C.ink,marginTop:11,marginBottom:5},input:{borderWidth:1,borderColor:"#D8E0E0",borderRadius:8,minHeight:43,paddingHorizontal:11,paddingVertical:9,color:C.ink,backgroundColor:"#FEFFFF"},smallNote:{fontSize:11,color:C.muted,lineHeight:16,marginTop:12},successBox:{backgroundColor:"#E2F8EE",padding:15,borderRadius:12},successTitle:{fontSize:18,fontWeight:"900",color:"#14754E"},
 contactCard:{backgroundColor:C.white,borderRadius:12,padding:14,flexDirection:"row",alignItems:"center",marginBottom:10,borderWidth:1,borderColor:C.border},contactIcon:{fontSize:23,color:C.orange,width:45},contactTitle:{fontSize:14,fontWeight:"900",color:C.ink},bottomNav:{height:58,backgroundColor:C.white,borderTopWidth:1,borderTopColor:C.border,flexDirection:"row",justifyContent:"space-around",alignItems:"center"},navItem:{alignItems:"center",justifyContent:"center",flex:1},navIcon:{fontSize:20,fontWeight:"700"},navLabel:{fontSize:10,marginTop:1}
});
