extern crate reqwest;
use std::io::Read;

fn main() {
    Getreq();

}

fn Getreq() -> Result<reqwest::Response, reqwest::Error>{
    let mut resp = reqwest::get("http://localhost:3000/hello")?;
    assert!(resp.status().is_success());

    let mut content = String::new();
    resp.read_to_string(&mut content);
    println!("{}", content);
    Ok(resp)
}
