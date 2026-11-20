import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const uid = "aNwc6iGkfSbM06kh8SQSbCduLeG3"; // UID Anda
    await adminAuth.setCustomUserClaims(uid, { admin: true });
    
    return NextResponse.json({ 
      success: true, 
      message: "Mantap! Anda sekarang Admin." 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}