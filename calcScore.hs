import System.Environment
import System.Random

calc :: (Integral t) => t -> [t] -> [t]
calc precentage nums = map (\num -> truncate ((fromIntegral num) * (fromIntegral precentage) / (fromIntegral 100))) nums

randAlter :: (RandomGen g, Integral t) => g -> [t] -> [Int]
randAlter rdgen ([]) = []
randAlter rdgen (it:itleft) = (fromIntegral it + nSam):(randAlter nrdgen itleft) where (nSam, nrdgen) = randomR (-2, 2) rdgen

processInput :: Int -> IO ()
processInput precentage = do
  inp <- getLine
  let nums = [read numStr | numStr <- words inp ] :: [Int]
  let calcRes = calc precentage nums
  rdgen <- newStdGen
  let alteredRes = randAlter rdgen calcRes
  let res = unwords ( map show alteredRes )
  putStrLn res
  processInput precentage
  return ()

main = do
  args <- getArgs
  let precentage = read ( head args )
  if length args /= 1 then error "./calcScore precentage" else processInput precentage
