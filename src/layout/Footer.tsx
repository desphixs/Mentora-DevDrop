import { Github, Mail, Twitter } from "lucide-react";
import { COLORPALLETE } from "./Header";
export default function Footer() {
    return (
        <footer className="border-t border-zinc-200/60 dark:border-zinc-800 mt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <h4 className={`font-semibold ${COLORPALLETE.textPrimaryClass}`}>Mentora</h4>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Inventory without chaos. Real-time tracking, alerts, and analytics.</p>
                        <div className="mt-4 flex gap-3">
                            <a className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900" href="#">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900" href="#">
                                <Github className="h-4 w-4" />
                            </a>
                            <a className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900" href="#">
                                <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h5 className="font-semibold">Product</h5>
                        <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                            
                            <li>
                                <a href="/howitworks">How it works</a>
                            </li>
                            <li>
                                <a href="/pricing">Pricing</a>
                            </li>
                            <li>
                                <a href="/faq">FAQ</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-semibold">Company</h5>
                        <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <li>
                                <a href="/about">About</a>
                            </li>
                            <li>
                                <a href="/contact">Contact</a>
                            </li>
                            <li>
                                <a href="/changelog">Changelog</a>
                            </li>
                            <li>
                                <a href="/status">Status</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-semibold">Legal</h5>
                        <ul className="mt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <li>
                                <a href="/privacy">Privacy</a>
                            </li>
                            <li>
                                <a href="/terms">Terms</a>
                            </li>
                            <li>
                                <a href="/refund-policy">Refund Policy</a>
                            </li>
                            <li>
                                <a href="/cookie-policy">Cookie Policy</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className={`h-[2px] w-full sm:w-1/3 bg-gradient-to-r ${COLORPALLETE.gradient.brand}`} />
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">© {new Date().getFullYear()} Mentora. All rights reserved.</p>
                    <div className={`hidden sm:block h-[2px] w-1/3 bg-gradient-to-r ${COLORPALLETE.gradient.brand}`} />
                </div>
            </div>
        </footer>
    );
}
